import { ComponentPropsWithoutRef } from 'react';

export const CrossIcon = ({
  name,
  ...props
}: ComponentPropsWithoutRef<'svg'>) => {
  return (
    <svg
      aria-labelledby={name}
      height={24}
      name={name}
      role="presentation"
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 6.48526L6 18.4853"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M6 6.48526L18 18.4853"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};
