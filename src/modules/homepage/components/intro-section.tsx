import Image from 'next/image';

import lowercaseLogo from 'public/images/home/lowercase-logo.webp';

export function IntroSection() {
  return (
    <section>
      <h1 className="text-base font-medium">sushan.</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        design engineer at{' '}
        <a
          className="inline-flex items-baseline ml-1 gap-1 text-text-primary underline underline-offset-2 transition-colors duration-150 ease-out hover:text-text-secondary"
          href="https://lowercase.club"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="lowercase"
            className="relative top-0.5 inline size-3.5"
            src={lowercaseLogo}
            unoptimized
          />
          lowercase
        </a>
        . into motion, creative coding, and the small details that make
        interfaces feel right.
      </p>
      <p className="mt-3 text-sm text-text-secondary">
        find me on{' '}
        <a
          className="text-text-primary underline underline-offset-2 transition-colors duration-150 ease-out hover:text-text-secondary hitbox"
          href="https://github.com/sushanyadav"
          rel="noopener noreferrer"
          target="_blank"
        >
          github
        </a>
        {' '}and{' '}
        <a
          className="text-text-primary underline underline-offset-2 transition-colors duration-150 ease-out hover:text-text-secondary hitbox"
          href="https://x.com/__sushan"
          rel="noopener noreferrer"
          target="_blank"
        >
          x
        </a>
        .
      </p>
    </section>
  );
}
