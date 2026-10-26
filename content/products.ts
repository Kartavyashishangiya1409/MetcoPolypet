export type Tint = 'clear' | 'blue' | 'green' | 'amber' | 'white';

export type Application =
  | 'Water'
  | 'CSD'
  | 'Juice & dairy'
  | 'Edible oil'
  | 'Pharma'
  | 'Personal care'
  | 'Jars';

export interface Product {
  /** Public URL slug */
  slug: string;
  /** Design-file id, used as the image key */
  id: string;
  name: string;
  neck: string;
  w: string;
  h: string;
  app: Application;
  colours: string;
  vol: string;
  tint: Tint;
  /** Preform render spec: "neck,length,tint" */
  pf: string;
}

const RAW: Omit<Product, 'pf'>[] = [
  { slug: '28mm-pco-1881-9-5g', id: 'pco1881-9-5', name: '28 mm PCO 1881 · 9.5 g', neck: '28 mm PCO 1881', w: '9.5 g', h: '72 mm', app: 'Water', colours: 'Clear, light blue', vol: '200 – 300 ml', tint: 'clear' },
  { slug: '28mm-pco-1881-12-5g', id: 'pco1881-12-5', name: '28 mm PCO 1881 · 12.5 g', neck: '28 mm PCO 1881', w: '12.5 g', h: '84 mm', app: 'Water', colours: 'Clear, light blue', vol: '500 ml', tint: 'blue' },
  { slug: '28mm-pco-1881-18g', id: 'pco1881-18', name: '28 mm PCO 1881 · 18 g', neck: '28 mm PCO 1881', w: '18 g', h: '98 mm', app: 'Water', colours: 'Clear, light blue', vol: '1 L', tint: 'blue' },
  { slug: '28mm-pco-1881-25g', id: 'pco1881-25', name: '28 mm PCO 1881 · 25 g', neck: '28 mm PCO 1881', w: '25 g', h: '110 mm', app: 'CSD', colours: 'Clear, green', vol: '600 ml – 1 L', tint: 'clear' },
  { slug: '28mm-pco-1810-28g', id: 'pco1810-28', name: '28 mm PCO 1810 · 28 g', neck: '28 mm PCO 1810', w: '28 g', h: '116 mm', app: 'CSD', colours: 'Clear, green', vol: '1 – 1.25 L', tint: 'green' },
  { slug: '28mm-pco-1810-42g', id: 'pco1810-42', name: '28 mm PCO 1810 · 42 g', neck: '28 mm PCO 1810', w: '42 g', h: '138 mm', app: 'CSD', colours: 'Clear, green', vol: '2 – 2.25 L', tint: 'clear' },
  { slug: '30-25-short-neck-19g', id: 'n3025-19', name: '30/25 · 19 g', neck: '30/25 short neck', w: '19 g', h: '90 mm', app: 'Water', colours: 'Clear, light blue', vol: '1 – 2 L', tint: 'blue' },
  { slug: '38mm-3-start-30g', id: 'n38-30', name: '38 mm 3-start · 30 g', neck: '38 mm 3-start', w: '30 g', h: '96 mm', app: 'Juice & dairy', colours: 'Clear, white opaque', vol: '500 ml – 1 L', tint: 'white' },
  { slug: '46mm-42g', id: 'n46-42', name: '46 mm · 42 g', neck: '46 mm', w: '42 g', h: '112 mm', app: 'Edible oil', colours: 'Clear, amber tint', vol: '1 L', tint: 'amber' },
  { slug: '48mm-85g', id: 'n48-85', name: '48 mm · 85 g', neck: '48 mm', w: '85 g', h: '150 mm', app: 'Edible oil', colours: 'Clear', vol: '5 L', tint: 'clear' },
  { slug: '63mm-wide-mouth-48g', id: 'n63-48', name: '63 mm wide-mouth · 48 g', neck: '63 mm', w: '48 g', h: '78 mm', app: 'Jars', colours: 'Clear', vol: '500 g – 1 kg jars', tint: 'clear' },
  { slug: '20-410-8g', id: 'n20-8', name: '20/410 · 8 g', neck: '20 mm 20/410', w: '8 g', h: '64 mm', app: 'Pharma', colours: 'Clear, amber, white', vol: '60 – 100 ml', tint: 'amber' },
  { slug: '24-410-14g', id: 'n24-14', name: '24/410 · 14 g', neck: '24 mm 24/410', w: '14 g', h: '82 mm', app: 'Personal care', colours: 'Clear, white, custom', vol: '200 – 300 ml', tint: 'white' },
];

export const products: Product[] = RAW.map((p) => ({
  ...p,
  pf: `${parseInt(p.neck)},${parseInt(p.h)},${p.tint}`,
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Products sorted by height — the "lineup" banner render */
export const lineup = products
  .slice()
  .sort((a, b) => parseInt(a.h) - parseInt(b.h))
  .map((p) => p.pf)
  .join(';');

export const applications = [
  'All',
  'Water',
  'CSD',
  'Juice & dairy',
  'Edible oil',
  'Pharma',
  'Personal care',
  'Jars',
] as const;

export const MATERIAL = 'Food-grade PET';
export const PACKING = 'Lined carton / octabin';

export function specRows(p: Product) {
  return [
    { k: 'Neck finish', v: p.neck },
    { k: 'Weight', v: p.w },
    { k: 'Preform height', v: p.h },
    { k: 'Bottle volume', v: p.vol },
    { k: 'Application', v: p.app },
    { k: 'Colours', v: p.colours },
    { k: 'Material', v: MATERIAL },
    { k: 'Packing', v: PACKING },
  ];
}

/** Plain-language summary of a product (detail page answer block, meta description, JSON-LD) */
export function describe(p: Product) {
  return `${p.neck} PET preform, ${p.w}, ${p.h} high, for ${p.vol} ${p.app.toLowerCase()} bottles. Colours: ${p.colours.toLowerCase()}. ${MATERIAL}.`;
}

// TODO: per-product spec sheet PDFs, keyed by slug (e.g. '/spec-sheets/48mm-85g.pdf').
// Until a PDF exists the "Spec sheet (PDF)" link requests one from sales by email.
const SPEC_SHEETS: Partial<Record<string, string>> = {};
export const specSheetHref = (p: Product) => SPEC_SHEETS[p.slug] ?? null;

export const customSteps = [
  { n: '01', t: 'Brief', d: 'Bottle drawing or sample, target weight, closure and volume.' },
  { n: '02', t: 'Preform design', d: 'Wall thickness and length designed for your blow-moulding setup.' },
  { n: '03', t: 'Mould and sampling', d: 'Mould built and trial preforms sent for your blowing tests.' },
  { n: '04', t: 'Production', d: 'Approved samples become the reference for every batch.' },
];
