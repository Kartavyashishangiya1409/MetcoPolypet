import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/content/site';
import { products } from '@/content/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/products'), lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: absoluteUrl('/about'), lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: absoluteUrl('/contact'), lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ];
}
