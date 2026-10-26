import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { describe, getProduct, products } from '@/content/products';
import { ProductDetail } from '@/components/products/ProductDetail';
import { TransitionLink } from '@/components/layout/TransitionLink';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, product as productSchema } from '@/lib/schema';
import s from './page.module.scss';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const description = `${describe(p)} Made in India by Metco Polypet.`;
  return buildMetadata({
    title: `${p.name} PET Preform | Metco Polypet`,
    description: description.length > 155 ? describe(p) : description,
    path: `/products/${p.slug}`,
  });
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const path = `/products/${p.slug}`;

  return (
    <article data-page={`product-${p.slug}`} className={s.page}>
      <JsonLd
        data={[
          productSchema(p),
          breadcrumbs([
            { name: 'Products', path: '/products' },
            { name: p.name, path },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <ol>
          <li>
            <TransitionLink href="/">Home</TransitionLink>
          </li>
          <li>
            <TransitionLink href="/products">Products</TransitionLink>
          </li>
          <li aria-current="page">{p.name}</li>
        </ol>
      </nav>
      <div className={s.frame}>
        <ProductDetail product={p} as="h1" summary={describe(p)} />
      </div>
      <p className={s.note}>
        Dimensions are indicative. Final specifications are confirmed on the quotation.{' '}
        <TransitionLink href="/products">View all preforms →</TransitionLink>
      </p>
    </article>
  );
}
