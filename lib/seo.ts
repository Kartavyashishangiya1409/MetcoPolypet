import type { Metadata } from 'next';
import { site, absoluteUrl } from '@/content/site';

type PageMeta = {
  /** ≤ 60 characters, used verbatim (no template) */
  title: string;
  /** ≤ 155 characters */
  description: string;
  path: string;
  /** OG image path (route-local opengraph-image is picked up automatically when omitted) */
  image?: string;
};

export function buildMetadata({ title, description, path, image }: PageMeta): Metadata {
  if (process.env.NODE_ENV !== 'production') {
    if (title.length > 60) console.warn(`[seo] title > 60 chars (${title.length}): ${title}`);
    if (description.length > 155)
      console.warn(`[seo] description > 155 chars (${description.length}): ${path}`);
  }
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
