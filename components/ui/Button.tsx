import type { ComponentProps, ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/TransitionLink';
import s from './Button.module.scss';

type Variant = 'dark' | 'light' | 'outline-dark';
type Size = 'md' | 'lg' | 'submit';

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

const cx = (variant: Variant, size: Size, className?: string) =>
  [s.btn, s[variant], s[size], className].filter(Boolean).join(' ');

/** Pill CTA. With `href` it renders a transition link, otherwise a <button>. */
export function ButtonLink({
  href,
  variant = 'dark',
  size = 'md',
  className,
  children,
  ...rest
}: Common & { href: string } & Omit<ComponentProps<typeof TransitionLink>, 'href' | 'className'>) {
  return (
    <TransitionLink href={href} className={cx(variant, size, className)} {...rest}>
      {children}
    </TransitionLink>
  );
}

export function Button({
  variant = 'dark',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: Common & Omit<ComponentProps<'button'>, 'className'>) {
  return (
    <button type={type} className={cx(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

/** Underlined text link ("Request a quote", "View full catalogue →") */
export function TextLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof TransitionLink>,
  'href' | 'className'
>) {
  return (
    <TransitionLink href={href} className={[s.text, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </TransitionLink>
  );
}
