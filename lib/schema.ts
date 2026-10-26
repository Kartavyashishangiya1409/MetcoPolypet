// JSON-LD builders (schema.org). Rendered with <JsonLd />. NAP comes from content/site.ts only.
import { site, absoluteUrl } from '@/content/site';
import { MATERIAL, PACKING, type Product } from '@/content/products';
import { imagePath } from '@/content/preform-images';
import manifest from '@/content/preform-manifest.json';

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

const isPlaceholder = (v: string) => /\[.*\]/.test(v);

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.countryCode,
});

const imageUrl = (id: string) =>
  absoluteUrl(imagePath(id, (manifest as Record<string, { w2: number }>)[id].w2, 'webp'));

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Manufacturer'],
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absoluteUrl('/icon.svg'),
    image: imageUrl('about-lineup'),
    email: site.email.sales,
    telephone: site.phone.tel,
    address: postalAddress(),
    ...(isPlaceholder(site.foundingYear) ? {} : { foundingDate: site.foundingYear }),
    ...(isPlaceholder(site.gstin) ? {} : { taxID: site.gstin }),
    knowsAbout: [
      'PET preforms',
      'Injection moulding',
      '28 mm PCO 1881 preforms',
      '28 mm PCO 1810 preforms',
      'Edible oil preforms',
      'Wide-mouth jar preforms',
    ],
    areaServed: { '@type': 'Country', name: 'India' },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: site.email.sales,
        telephone: site.phone.tel,
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'export sales',
        email: site.email.exports,
      },
    ],
    sameAs: site.socials.map((s) => s.href).filter(Boolean),
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function webPage(
  type: 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'WebPage',
  { name, description, path }: { name: string; description: string; path: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
  };
}

export function productListing(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Metco Polypet PET preform catalogue',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: `${p.name} PET preform`,
    })),
  };
}

export function product(p: Product) {
  const prop = (name: string, value: string, unitCode?: string) => ({
    '@type': 'PropertyValue',
    name,
    value,
    ...(unitCode ? { unitCode } : {}),
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${absoluteUrl(`/products/${p.slug}`)}#product`,
    name: `${p.name} PET preform`,
    description: `${p.neck} PET preform, ${p.w}, ${p.h} high, for ${p.vol} ${p.app.toLowerCase()} bottles. Available in ${p.colours.toLowerCase()}. ${MATERIAL}.`,
    sku: p.slug,
    category: 'PET preforms',
    material: MATERIAL,
    color: p.colours,
    image: [imageUrl(`card-${p.id}`), imageUrl(`macro-${p.id}`)],
    url: absoluteUrl(`/products/${p.slug}`),
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@id': ORG_ID },
    weight: { '@type': 'QuantitativeValue', value: parseFloat(p.w), unitCode: 'GRM' },
    height: { '@type': 'QuantitativeValue', value: parseFloat(p.h), unitCode: 'MMT' },
    additionalProperty: [
      prop('Neck finish', p.neck),
      prop('Weight', p.w),
      prop('Preform height', p.h),
      prop('Bottle volume', p.vol),
      prop('Colours', p.colours),
      prop('Material', MATERIAL),
      prop('Application', p.app),
      prop('Packing', PACKING),
    ],
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
