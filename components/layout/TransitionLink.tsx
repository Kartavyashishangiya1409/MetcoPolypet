'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useNav } from './PageTransition';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** next/link that plays the page-wipe transition. Modified clicks behave like normal links. */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const { navigate } = useNav();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === '_blank'
        )
          return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
