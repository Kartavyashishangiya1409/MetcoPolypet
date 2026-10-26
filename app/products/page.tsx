import { products } from '@/content/products';
import { faqs } from '@/content/faqs';
import { ProductsHero, CustomPreform, ProductFaq } from '@/components/products/ProductsSections';
import { Catalogue } from '@/components/products/Catalogue';
import { ProductCard } from '@/components/products/ProductCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, faqPage, productListing, webPage } from '@/lib/schema';
import s from '@/components/products/Products.module.scss';

const title = 'PET Preforms, 20–63 mm Neck & 6–85 g | Metco Polypet';
const description =
  'PET preform catalogue: 28 mm PCO 1881 and 1810, 30/25, 38, 46, 48 and 63 mm wide-mouth, 20/410 and 24/410 necks, 6 g to 85 g. Custom moulds on request.';

export const metadata = buildMetadata({ title, description, path: '/products' });

export default function ProductsPage() {
  return (
    <article data-page="products">
      <JsonLd
        data={[
          webPage('CollectionPage', { name: title, description, path: '/products' }),
          breadcrumbs([{ name: 'Products', path: '/products' }]),
          productListing(products),
          faqPage(faqs),
        ]}
      />
      <ProductsHero />
      <section aria-labelledby="cat-h" className={s.catalogue}>
        <Catalogue
          items={products.map((p) => ({
            slug: p.slug,
            app: p.app,
            card: <ProductCard product={p} />,
          }))}
        />
        <p className={s.note}>
          Dimensions are indicative. Final specifications are confirmed on the quotation.
        </p>
      </section>
      <CustomPreform />
      <ProductFaq />
    </article>
  );
}
