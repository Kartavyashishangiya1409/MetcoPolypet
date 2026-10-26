// Every static preform render used on the site. `scripts/render-preforms.mjs` reads this file
// and writes /public/images/preforms/<id>-<px>.{avif,webp} at 1x and 2x, plus
// content/preform-manifest.json.
//
// Render specs (layout/items/bg/pad/count/ox/oy) are copied from `Metco Polypet Website.dc.html`.
// `w`/`h` are the CSS-pixel size of the slot at a 1440px viewport.
//
// How a static render stays faithful at every slot size: the design's camera fits the object's
// bounding box so it fills 1/pad of the slot's *limiting* dimension, on a solid background.
//  - fit 'pad'   (single, tilt, trio, lineup): the render is trimmed to the object's pixels and
//                the manifest records the fill fraction `f`. It is shown with object-fit:contain
//                inside a centred box of f × the slot — identical framing at any aspect ratio.
//  - fit 'cover' (pile, macro): the object intentionally runs off-frame, so the full render is
//                shown with object-fit:cover (plus a portrait variant where the aspect flips).

import { products, lineup } from './products.ts';
import { story, necks, industries } from './home.ts';

export const BG = { light: '#E7E7E2', dark: '#1A1B1B', ink: '#0C0D0D' } as const;

export type Layout = 'single' | 'tilt' | 'macro' | 'trio' | 'lineup' | 'pile';

export interface RenderSpec {
  layout: Layout;
  items: string;
  bg: string;
  count?: string;
  pad?: string;
  ox?: string;
  oy?: string;
}

export interface PreformImageSpec extends RenderSpec {
  w: number;
  h: number;
  fit: 'pad' | 'cover';
  /** Optional art-directed render for narrow screens */
  mobile?: { w: number; h: number; maxWidth: number };
}

const S = (
  layout: Layout,
  items: string,
  bg: string,
  w: number,
  h: number,
  extra: Partial<PreformImageSpec> = {},
): PreformImageSpec => ({
  layout,
  items,
  bg,
  w,
  h,
  fit: layout === 'pile' || layout === 'macro' ? 'cover' : 'pad',
  ...extra,
});

const entries: [string, PreformImageSpec][] = [
  // Home — story
  ...story.map((s, i): [string, PreformImageSpec] => [
    `story-${i + 1}`,
    S(s.layout, s.pf, BG.light, 640, 620),
  ]),
  // Home — range rail
  ...necks.map((k): [string, PreformImageSpec] => [`rail-${k.id}`, S('single', k.pf, BG.dark, 380, 420)]),
  // Home — industries thumbs
  ...industries.map((i): [string, PreformImageSpec] => [
    `industry-${i.id}`,
    S('tilt', i.pf, BG.light, 96, 72),
  ]),
  // Home — manufacturing (parallax layer is 120% of section height)
  [
    'manufacturing',
    S('pile', '28,98,clear;30,90,blue;28,110,clear;28,116,clear', BG.ink, 1440, 1080, {
      count: '28',
      pad: '1.15',
      ox: '6',
      oy: '1.5',
      mobile: { w: 390, h: 1000, maxWidth: 759 },
    }),
  ],
  // About
  ['about-lineup', S('lineup', lineup, BG.light, 1328, 630, { pad: '1.15' })],
  [
    'infra-machines',
    S('pile', '28,98,clear;30,90,blue;28,110,clear', BG.light, 400, 440, { count: '30', pad: '1.0' }),
  ],
  [
    'infra-moulds',
    S('lineup', '28,98,clear;28,98,clear;28,98,clear;28,98,clear', BG.light, 320, 440, { pad: '1.2' }),
  ],
  ['infra-lab', S('macro', '38,96,white', BG.light, 320, 440, { mobile: { w: 335, h: 280, maxWidth: 667 } })],
  ['infra-store', S('trio', '46,112,amber;28,116,green;63,78,clear', BG.light, 320, 440, { pad: '1.25' })],
  ['team-1', S('tilt', '28,110,clear', BG.light, 430, 322)],
  ['team-2', S('tilt', '30,90,blue', BG.light, 430, 322)],
  ['team-3', S('tilt', '28,116,green', BG.light, 430, 322)],
  // Products
  ['products-lineup', S('lineup', lineup, BG.dark, 1328, 504, { pad: '1.15' })],
  ...products.map((p): [string, PreformImageSpec] => [`card-${p.id}`, S('single', p.pf, BG.light, 320, 420)]),
  ...products.map((p): [string, PreformImageSpec] => [`macro-${p.id}`, S('macro', p.pf, BG.light, 600, 720)]),
  // Contact
  ['contact-trio', S('trio', '30,90,blue;28,116,clear;48,150,amber', BG.dark, 1328, 560, { pad: '1.2' })],
];

export const preformImages: Record<string, PreformImageSpec> = Object.fromEntries(entries);

export type PreformImageId = keyof typeof preformImages;

/** Longest edge cap, as in preform-img.js */
export const MAX_EDGE = 2200;

export function renderSizes(w: number, h: number) {
  const s2 = Math.min(2, MAX_EDGE / Math.max(w, h));
  return [
    { scale: '1x', w, h },
    { scale: '2x', w: Math.round(w * s2), h: Math.round(h * s2) },
  ];
}

export const imagePath = (id: string, pxWidth: number, ext: 'avif' | 'webp' | 'png') =>
  `/images/preforms/${id}-${pxWidth}.${ext}`;

/** Extra PNG master used by opengraph-image (Satori can't read AVIF/WebP) */
export const OG_SOURCE = { id: 'og-lineup', spec: S('lineup', lineup, BG.light, 1200, 520, { pad: '1.1' }) };

/** Hero poster (LCP image) — source assets/hero-preform.png, 1122×1402 with alpha */
export const HERO_POSTER = { width: 1122, height: 1402, widths: [420, 700, 1122] } as const;
export const heroPosterPath = (w: number, ext: 'avif' | 'webp') => `/images/hero/hero-preform-${w}.${ext}`;
