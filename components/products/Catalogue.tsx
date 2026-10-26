'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { applications } from '@/content/products';
import { ScrollTrigger } from '@/components/motion/gsap';
import s from './Catalogue.module.scss';

type Item = { slug: string; app: string; card: ReactNode };

/**
 * Filter chips + grid. All cards are server-rendered; filtering only toggles `hidden`, so every
 * product link stays in the HTML for crawlers.
 */
export function Catalogue({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>('All');
  const shown = items.filter((i) => filter === 'All' || i.app === filter).length;

  // The page gets shorter/taller — keep scroll-triggered effects below in sync.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <>
      <div className={s.head}>
        <h2 id="cat-h" className={s.h2}>
          Catalogue
        </h2>
        <span className={s.count} aria-live="polite">
          {shown} preform{shown === 1 ? '' : 's'}
        </span>
      </div>
      <div role="group" aria-label="Filter by application" className={s.chips}>
        {applications.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={a === filter}
            className={s.chip}
            onClick={() => setFilter(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className={s.grid}>
        {items.map((i) => (
          <div key={i.slug} hidden={filter !== 'All' && i.app !== filter} className={s.cell}>
            {i.card}
          </div>
        ))}
      </div>
    </>
  );
}
