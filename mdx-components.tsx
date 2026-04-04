import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(
  components: MDXComponents,
): MDXComponents {
  return {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        target={href?.startsWith('http') ? '_blank' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    ...components,
  };
}
