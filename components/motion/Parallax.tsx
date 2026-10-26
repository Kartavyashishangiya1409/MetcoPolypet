import type { ReactNode } from 'react';

type Props = { className?: string; children: ReactNode };

/** Scrubbed parallax layer: yPercent -8 → 8 across its parent's pass through the viewport. */
export function Parallax({ className, children }: Props) {
  return (
    <div data-parallax="" className={className}>
      {children}
    </div>
  );
}
