import type { ComponentPropsWithoutRef } from 'react';

type LogoProps = ComponentPropsWithoutRef<'svg'>;

export function Logo(props: LogoProps) {
  return (
    <svg
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        fill="#1768FF"
        height="8.85595"
        stroke="#1F6AED"
        strokeWidth="3"
        transform="rotate(89.5772 10.3666 1.51103)"
        width="8.85595"
        x="10.3666"
        y="1.51103"
      />
    </svg>
  );
}
