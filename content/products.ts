export type Tint = 'clear' | 'blue' | 'green' | 'amber' | 'white';

export type Application = 'Water' | 'CSD' | 'Juice & dairy';

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
  {
    slug: '28mm-pco-1881-9-5g',
    id: 'pco1881-9-5',
    name: '28 mm PCO 1881 · 9.5 g',
    neck: '28 mm PCO 1881',
    w: '9.5 g',
    h: '72 mm',
    app: 'Water',
    colours: 'Clear, light blue',
    vol: '200 – 300 ml',
    tint: 'clear',
  },
  {
    slug: '28mm-pco-1881-12-5g',
    id: 'pco1881-12-5',
    name: '28 mm PCO 1881 · 12.5 g',
    neck: '28 mm PCO 1881',
    w: '12.5 g',
    h: '84 mm',
    app: 'Water',
    colours: 'Clear, light blue',
    vol: '500 ml',
    tint: 'blue',
  },
  {
    slug: '28mm-pco-1881-18g',
    id: 'pco1881-18',
    name: '28 mm PCO 1881 · 18 g',
    neck: '28 mm PCO 1881',
    w: '18 g',
    h: '98 mm',
    app: 'Water',
    colours: 'Clear, light blue',
    vol: '1 L',
    tint: 'blue',
  },
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

// TODO: per-product spec sheet PDFs, keyed by slug (e.g. '/spec-sheets/28mm-pco-1881-18g.pdf').
// Until a PDF exists the "Spec sheet (PDF)" link requests one from sales by email.
const SPEC_SHEETS: Partial<Record<string, string>> = {};
export const specSheetHref = (p: Product) => SPEC_SHEETS[p.slug] ?? null;

export const customSteps = [
  { n: '01', t: 'Brief', d: 'Bottle drawing or sample, target weight, closure and volume.' },
  {
    n: '02',
    t: 'Preform design',
    d: 'Wall thickness and length designed for your blow-moulding setup.',
  },
  {
    n: '03',
    t: 'Mould and sampling',
    d: 'Mould built and trial preforms sent for your blowing tests.',
  },
  { n: '04', t: 'Production', d: 'Approved samples become the reference for every batch.' },
];
