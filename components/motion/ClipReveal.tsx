import type { ReactNode } from 'react';
import s from './ClipReveal.module.scss';

type Props = {
  className?: string;
  children: ReactNode;
  /** Reveal on load (CSS) instead of on scroll */ now?: boolean;
};

/** Clip wipe: inset(100% 0 0 0) → inset(0) while the inner layer scales 1.2 → 1. */
export function ClipReveal({ className, children, now }: Props) {
  return (
    <div {...(now ? { 'data-wipe-now': '' } : { 'data-wipe': '' })} className={className}>
      <div className={s.inner}>{children}</div>
    </div>
  );
}
