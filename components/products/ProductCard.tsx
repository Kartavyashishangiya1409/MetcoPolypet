import Link from 'next/link';
import type { Product } from '@/content/products';
import { PreformImage } from '@/components/ui/PreformImage';
import s from './Catalogue.module.scss';

/**
 * Catalogue card. The heading link is stretched over the whole card; a plain click opens the
 * detail modal (intercepted route), a direct visit renders the full product page.
 */
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className={s.card}>
      <div className={s.media}>
        <PreformImage
          id={`card-${p.id}`}
          alt={`${p.name} PET preform`}
          sizes="(min-width: 1440px) 320px, (min-width: 700px) 33vw, 100vw"
        />
      </div>
      <div className={s.row}>
        <h3 className={s.name}>
          <Link href={`/products/${p.slug}`} scroll={false} className={s.link}>
            {p.name}
          </Link>
        </h3>
        <span className={s.weight}>{p.w}</span>
      </div>
      <dl className={s.specs}>
        <dt>Neck</dt>
        <dd>{p.neck}</dd>
        <dt>Height</dt>
        <dd>{p.h}</dd>
        <dt>Use</dt>
        <dd>{p.app}</dd>
      </dl>
    </article>
  );
}
