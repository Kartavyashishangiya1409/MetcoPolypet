// Single source of truth for NAP (name, address, phone) and company facts.
// Every value in [brackets] is a PLACEHOLDER awaiting real data from the client — see TODO.md.

export const site = {
  name: 'Metco Polypet',
  legalName: 'Metco Polypet Pvt. Ltd.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.metcopolypet.com').replace(/\/$/, ''),
  tagline: "PET preforms for India's bottlers.",
  description:
    'Manufacturer of PET preforms for drinking water, soft drink, juice and dairy packaging.',
  locale: 'en_IN',

  phone: {
    display: '+91 [00000 00000]',
    tel: '+910000000000',
  },
  whatsapp: {
    label: 'Message us',
    // Derived from the phone number; override if WhatsApp uses a different number.
    href: 'https://wa.me/910000000000',
  },
  email: {
    sales: 'sales@metcopolypet.com',
    exports: 'exports@metcopolypet.com',
    careers: 'careers@metcopolypet.com',
  },

  address: {
    street: '[Plot no., Industrial area]',
    city: 'Rajkot',
    region: 'Gujarat',
    postalCode: '[PIN]',
    country: 'India',
    countryCode: 'IN',
    /** Short form used in the footer */
    short: 'Rajkot, Gujarat, India',
    /** Second line on the contact page */
    cityLine: 'Rajkot, Gujarat [PIN], India',
  },
  hours: {
    display: 'Mon – Sat, 9:30 – 18:30 IST',
    schema: 'Mo-Sa 09:30-18:30',
  },
  // TODO: plant coordinates. Until then the map shows India at country zoom.
  geo: null as null | { lat: number; lng: number },

  gstin: '[00XXXXX0000X0X0]',
  foundingYear: '2026',
  copyrightYear: 2026,

  socials: [{ label: 'Instagram', href: 'https://www.instagram.com/metcopolypet' }],
} as const;

export const nav = [
  { href: '/', label: 'Home', transition: 'Home' },
  { href: '/about', label: 'About Us', transition: 'About' },
  { href: '/products', label: 'Products', transition: 'Products' },
  { href: '/contact', label: 'Contact Us', transition: 'Contact' },
] as const;

export function transitionLabel(pathname: string): string {
  if (pathname.startsWith('/products')) return 'Products';
  return nav.find((n) => n.href === pathname)?.transition ?? 'Home';
}

export const absoluteUrl = (path = '/') => site.url + (path === '/' ? '' : path);

export const mapSrc = site.geo
  ? `https://maps.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=14&output=embed`
  : 'https://maps.google.com/maps?q=India&z=5&output=embed';
