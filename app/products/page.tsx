import { products } from '@/content/products';
import { faqs } from '@/content/faqs';
import { ProductsHero, CustomPreform, ProductFaq } from '@/components/products/ProductsSections';
import { Catalogue } from '@/components/products/Catalogue';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, faqPage, productListing, webPage } from '@/lib/schema';
import s from '@/components/products/Products.module.scss';

const title = 'PET Preforms, 28 mm PCO 1881 & 9.5–18 g | Metco Polypet';
const description =
  'PET preform catalogue: 28 mm PCO 1881 preforms from 9.5 g to 18 g. Custom moulds on request.';

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
        <Catalogue products={products} />
        <p className={s.note}>
          Dimensions are indicative. Final specifications are confirmed on the quotation.
        </p>
      </section>
      <CustomPreform />
      <ProductFaq />
    </article>
  );
}
