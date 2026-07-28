import Image from 'next/image';

import lowercaseLogo from 'public/images/home/lowercase-logo.webp';

export function IntroSection() {
  return (
    <section>
      <h1 className="text-base font-medium">sushan.</h1>
      <p className="text-text-secondary mt-3 text-sm leading-relaxed">
        design engineer at{' '}
        <a
          className="text-text-primary hover:text-text-secondary ml-1 inline-flex items-baseline gap-1 underline underline-offset-2 transition-colors duration-150 ease-out"
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
      <p className="text-text-secondary mt-3 text-sm">
        find me on{' '}
        <a
          className="text-text-primary hover:text-text-secondary hitbox underline underline-offset-2 transition-colors duration-150 ease-out"
          href="https://github.com/sushanyadav"
          rel="noopener noreferrer"
          target="_blank"
        >
          github
        </a>{' '}
        and{' '}
        <a
          className="text-text-primary hover:text-text-secondary hitbox underline underline-offset-2 transition-colors duration-150 ease-out"
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
