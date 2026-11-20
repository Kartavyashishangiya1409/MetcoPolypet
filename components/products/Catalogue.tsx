import type { Product } from '@/content/products';
import { ProductCard } from './ProductCard';
import s from './Catalogue.module.scss';

/** Catalogue heading, count and the full grid of product cards. */
export function Catalogue({ products }: { products: Product[] }) {
  return (
    <>
      <div className={s.head}>
        <h2 id="cat-h" className={s.h2}>
          Catalogue
        </h2>
        <span className={s.count}>
          {products.length} preform{products.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className={s.grid}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
