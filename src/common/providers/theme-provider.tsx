'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

// Runs from SSR HTML before paint; keep in sync with setTheme below.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||((!t||t==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.dataset.theme=d?'dark':'light';e.style.colorScheme=d?'dark':'light';}catch(e){}})()`;

// Server-render only: the script has already executed by the time React
// hydrates, and client-rendering a <script> triggers a React 19 warning.
// (Same approach as next-themes PR #386.)
function ThemeScript() {
  if (typeof window !== 'undefined') return null;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
      suppressHydrationWarning
    />
  );
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // The boot script sets data-theme pre-paint; re-assert it on mount since
  // dev-mode re-renders (e.g. the 404 boundary) can wipe html attributes.
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') setThemeState(stored);
    const resolved =
      stored === 'light' || stored === 'dark' ? stored : systemTheme();
    applyTheme(resolved);
    setResolvedTheme(resolved);
  }, []);

  // Follow OS changes while in system mode.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      applyTheme(next);
      setResolvedTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    // Swap without CSS transitions firing on every element.
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        '*,*::before,*::after{transition:none!important}',
      ),
    );
    document.head.appendChild(style);

    const resolved = next === 'system' ? systemTheme() : next;
    localStorage.setItem('theme', next);
    applyTheme(resolved);
    setThemeState(next);
    setResolvedTheme(resolved);

    requestAnimationFrame(() => {
      window.getComputedStyle(document.body);
      requestAnimationFrame(() => style.remove());
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      <ThemeScript />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
