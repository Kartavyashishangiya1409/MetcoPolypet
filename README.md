# Metco Polypet website

Production site for Metco Polypet, an Indian manufacturer of PET preforms. Built from the
approved design in `Metco Polypet Website.dc.html`.

**Stack:** Next.js 15 (App Router, RSC, static generation) · TypeScript · SCSS Modules · GSAP +
ScrollTrigger · Lenis · Three.js (hero only) · Zod · Resend.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

| Script                                                  | What it does                            |
| ------------------------------------------------------- | --------------------------------------- |
| `npm run dev`                                           | Dev server                              |
| `npm run build` / `npm start`                           | Production build / serve it             |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint · `tsc --noEmit` · Prettier      |
| `npm run render:preforms`                               | Regenerate the static 3D preform images |
| `npm run compress:glb`                                  | Re-compress the hero GLB model          |

Requires Node 18.18+ for Next.js. The render script imports TypeScript content files directly,
which needs Node 22.18+ or 23.6+ (developed on Node 24).

## Environment variables

| Variable               | Required   | Purpose                                                                                                                                                   |
| ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Canonical origin, e.g. `https://www.metcopolypet.com`. Used for canonical URLs, sitemap, Open Graph and JSON-LD.                                          |
| `RESEND_API_KEY`       | yes (prod) | [Resend](https://resend.com) API key for the enquiry form. Without it, dev logs enquiries to the console; prod shows an error with the sales email/phone. |
| `ENQUIRY_TO`           | yes        | Inbox(es) for enquiries, comma-separated. Defaults to the sales email in `content/site.ts`.                                                               |
| `ENQUIRY_FROM`         | yes        | Verified sender on your Resend domain, e.g. `Metco Polypet <enquiries@metcopolypet.com>`.                                                                 |

## Editing content

All copy and data live in typed files under `content/` — no CMS.

- `site.ts` — name, address, phone, emails, hours, socials, map coordinates (single source of NAP)
- `products.ts` — the 13 preforms, catalogue filters, spec-sheet links, custom-development steps
- `home.ts`, `about.ts`, `faqs.ts`, `contact.ts` — page content

Values in `[square brackets]` are placeholders; see **TODO.md** for the full list.

Adding a product: add an entry to `RAW` in `content/products.ts` (unique `slug` and `id`), then
run `npm run render:preforms` to create its card and macro images. Its page, sitemap entry,
JSON-LD, form option and `/llms.txt` row are generated automatically.

## Static preform images (`render:preforms`)

The card, rail, banner and story images are **pre-rendered**, not drawn in the browser.

- `content/preform-images.ts` lists every image slot with the exact `layout` / `items` / `bg` /
  `pad` values from the design file.
- `scripts/render-preforms.mjs` serves `scripts/render/preform-render.js` (a verbatim port of the
  design's `preform-img.js`) to headless Chromium via Playwright, renders each slot at 2×,
  trims "pad" layouts to the object, derives 1×, encodes **AVIF + WebP** with sharp into
  `public/images/preforms/`, and writes `content/preform-manifest.json`.
- `<PreformImage id="…" alt="…" />` reads the manifest and renders a `<picture>` with explicit
  dimensions. The object fills the same share of its slot as the design's camera framing, so
  images stay faithful at every breakpoint.
- The script also encodes the hero poster (`assets/hero-preform.png`) to AVIF/WebP and renders the
  PNG used by the Open Graph images.

```bash
npx playwright install chromium     # once
npm run render:preforms             # only renders missing images
npm run render:preforms -- --force  # re-render everything
npm run render:preforms -- --only card-n48-85,manufacturing
```

## Hero 3D model (`compress:glb`)

`components/home/HeroPreform.tsx` is a line-for-line port of the design's `preform-glb.js`
(same glass shader, studio environment, camera fit, drag physics, float and shadow). The source
model `assets/metco-pet-preform.glb` (1.6 MB) is compressed with **Meshopt** via `gltf-transform`
to `public/models/metco-pet-preform.glb` (~275 KB, ~63 KB brotli). Meshopt was chosen over Draco
because its ~10 KB decoder ships inside three.js (Draco needs a ~250 KB WASM decoder).

The viewer is loaded with `next/dynamic({ ssr: false })` after the page is idle, in its own
chunk. The server-rendered poster image is the LCP element and cross-fades to the canvas once the
model has rendered. Rendering pauses off-screen and in hidden tabs; everything is disposed on
unmount.

```bash
npm run compress:glb
```

## How motion works

- **On-load reveals** (first heading, above-the-fold fades, top banners) are CSS keyframes using
  GSAP's `expo.out` curve sampled into `linear()` (`styles/_motion.scss`). They start at first
  paint without waiting for JavaScript, which keeps LCP fast and avoids flashes.
- **Scroll effects** are GSAP + ScrollTrigger, ported from the design's `init()` into
  `components/motion/initMotion.ts`, driven by data attributes (`data-split`, `data-fade`,
  `data-wipe`, `data-parallax`, `data-story`, `data-rail`, `data-hero-obj`).
- **Page transitions**: `components/layout/PageTransition.tsx` (port of `go()`) wipes a black
  panel with the page label, swaps the route, resets scroll and re-initialises motion.
- **Lenis** is connected to the GSAP ticker (`SmoothScroll.tsx`).
- **Reduced motion**: Lenis, scroll animations, sticky story/rail scroll-jacking, parallax and
  the hero auto-spin are off; content renders in its final state.

## Enquiry form

`app/contact/actions.ts` is a Server Action. The same Zod schema (`lib/enquiry-schema.ts`)
validates on the client (instant inline errors) and the server. It has a honeypot field and an
in-memory rate limit (5 per 10 minutes per IP). On serverless each instance has its own memory,
so this only slows bursts; for a hard limit swap `lib/rate-limit.ts` for Upstash Redis /
Vercel KV. Emails are plain text. The customer confirmation deliberately doesn't echo submitted
text, so the form can't be used to relay content to third parties. The form works without
JavaScript.

## SEO / AEO / GEO

- Metadata API on every page (unique title ≤ 60, description ≤ 155, canonical, Open Graph,
  Twitter); generated OG images per route (`opengraph-image.tsx`, `lib/og.tsx`).
- JSON-LD (`lib/schema.ts`): Organization + Manufacturer and WebSite on every page;
  BreadcrumbList on inner pages; AboutPage, ContactPage, CollectionPage + ItemList + FAQPage on
  `/products`; Product with `additionalProperty` on each product page.
- `app/sitemap.ts`, `app/robots.ts`, and `/llms.txt` (`app/llms.txt/route.ts`, generated from
  `content/` at build time so it never drifts from the site).
- All content is server-rendered HTML; FAQ answers are in the DOM while collapsed
  (`<details>`).

## Deploying on Vercel

1. Import the repository in Vercel (framework preset: Next.js; defaults are fine).
2. Add the environment variables above for Production (and Preview if wanted).
3. Verify the sending domain in Resend.
4. Deploy, then add the custom domain and submit `/sitemap.xml` in Google Search Console.

Every page is statically generated; only the enquiry Server Action runs on demand.
`/images/*` and `/models/*` are cached for a week with stale-while-revalidate (`next.config.ts`);
their file names are not content-hashed, so re-rendered images reach visitors within that window.

## Project layout

```
app/            routes (page.tsx per route, products/@modal intercepting route, contact/actions.ts,
                sitemap, robots, llms.txt, opengraph-image)
components/     layout/ (header, footer, transitions, Lenis) · motion/ · home/ · about/ ·
                products/ · contact/ · ui/
content/        all copy and data (typed)
lib/            seo, schema (JSON-LD), og, enquiry schema, rate limit, lenis
styles/         tokens, mixins, motion keyframes, globals
scripts/        render-preforms.mjs, compress-glb.mjs, render/ (browser-side renderer)
assets/         source files (GLB, hero PNG, OG fonts) — not served
```

The design-tool files (`support.js`, `image-slot.js`, `preform-3d.js`, `screenshots/`,
`uploads/`) are not part of the site.
