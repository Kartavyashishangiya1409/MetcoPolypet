import { notFound } from 'next/navigation';
import { getProduct, products } from '@/content/products';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductModal, CloseButton } from '@/components/products/ProductModal';

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

/** Card click from the catalogue: the detail opens as a dialog over the list. */
export default async function ProductModalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const labelId = `modal-${product.slug}`;
  return (
    <ProductModal labelId={labelId}>
      <ProductDetail product={product} headingId={labelId} close={<CloseButton />} />
    </ProductModal>
  );
}
