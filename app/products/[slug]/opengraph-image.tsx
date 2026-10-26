import { renderOg, ogSize, ogContentType } from '@/lib/og';
import { getProduct, products } from '@/content/products';

export const alt = 'Metco Polypet PET preform';
export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return renderOg({
    eyebrow: p ? p.app : 'Products',
    title: p ? `${p.name} PET preform` : 'PET preforms',
  });
}
