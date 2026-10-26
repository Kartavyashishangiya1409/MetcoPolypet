import type { ReactNode } from 'react';
import s from './SplitLines.module.scss';

type Props = {
  as?: 'h1' | 'h2' | 'p';
  id?: string;
  className?: string;
  /** One entry per visual line */
  lines: ReactNode[];
  /** Reveal on load (first heading on a page) instead of on scroll */
  now?: boolean;
};

/**
 * Headline line reveal: each line slides up from behind a mask (yPercent 115 → 0, expo.out,
 * 1.3s, stagger .09). Server component — the text is plain HTML.
 */
export function SplitLines({ as: Tag = 'h2', id, className, lines, now }: Props) {
  return (
    <Tag id={id} className={className} data-split="" {...(now ? { 'data-now': '' } : {})}>
      {lines.map((line, i) => (
        <span key={i} className={s.mask}>
          <span data-line="" className={s.line}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
