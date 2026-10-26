# Design Prompt — Metco Polypet Website

Copy everything below the line into Claude Design.

---

## 1. Brief

Design a premium, multi-page B2B website for **Metco Polypet**, a manufacturer of PET preforms in all sizes (water, CSD, juice, edible oil, pharma, personal care, jars). Buyers are procurement heads, plant managers and brand owners at beverage, FMCG and pharma companies. The site must convince them in under 10 seconds that Metco is precise, reliable and large-scale, then make it effortless to find the right preform and send an enquiry.

Pages: **Home, About Us, Products, Contact Us.**

## 2. Feel & art direction

- Reference quality bar: Apple product pages — restraint, huge whitespace, one idea per screen, product as the hero, cinematic scroll storytelling. Take the _level of polish_, not Apple's layouts, copy or branding. The design must be original.
- It must not look AI-generated. Avoid: purple/blue gradients, glassmorphism cards everywhere, emoji, generic icon grids, "rounded card with coloured left border", stock "handshake" imagery, filler stats, centred-everything hero with two buttons, Inter/Roboto/Poppins.
- Mood: clinical precision meets material beauty. PET is clear, glossy, refractive — let light, transparency and colour tints of preforms (clear, aqua, amber, green, white-opaque) carry the visual identity.
- Palette: near-white warm-neutral background (#F5F5F2 range), near-black ink (#111 range), one restrained accent pulled from a preform tint (e.g. cool aqua) used sparingly. One full-dark section per page for contrast and drama.
- Typography: a refined grotesk for display + body (e.g. "Neue Montreal", "Satoshi", "General Sans" or "Manrope" as fallback) and a monospace for specs/labels (e.g. "JetBrains Mono" / "IBM Plex Mono"). Display headlines 96–160px desktop, tight tracking (-0.03em), short line lengths. Specs set in mono, small caps-style labels.
- Grid: 12-column, generous margins, editorial asymmetry. Spacing scale on 8px.

## 3. Imagery — strict rule

- Use **realistic photographic or photoreal 3D renders of PET preforms only** — real product photography (studio-lit on seamless backgrounds, macro shots of neck finishes and threads, preforms in bulk, injection moulding machines, factory floor, QC lab).
- Do **not** draw illustrated, flat, vector or SVG preforms or any generated graphic art.
- Where an image is not yet available, place a clearly labelled image slot (e.g. "Photo: 28mm PCO 1881 neck macro, clear PET, black background") so the client's real photography can be dropped in.
- The hero 3D preform should be a real GLB model (Three.js) with a physically-based transparent PET material (transmission, IOR ≈ 1.57, slight tint), not a stylised shape.

## 4. Tech stack (for build & interactions)

- **Next.js (App Router)** with static generation for every page.
- **SCSS modules** for styling. **No Tailwind.**
- **GSAP + ScrollTrigger** for scroll-driven storytelling, pinned sections, split-text reveals.
- **Framer Motion** for UI micro-interactions and page transitions.
- **Three.js + GLSL shaders** for the hero preform and one refraction/caustics effect.
- **Lenis** for smooth scrolling (use Lenis; do not stack Locomotive on top of it).
- Respect `prefers-reduced-motion`: disable pinning/parallax, keep content fully readable.
- Performance budget: LCP < 2.0s, CLS < 0.05, INP < 200ms. Lazy-load the 3D scene after the first paint; show a static photo poster first.

## 5. Motion language

- Easing: custom expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`), durations 0.8–1.4s for reveals, 0.2–0.3s for hovers.
- Headlines reveal line-by-line with a mask (text slides up from behind a clip).
- Images reveal with a clip-path wipe + subtle scale from 1.1 to 1.
- Pinned scroll sequences: product rotates/scales while text panels change beside it.
- Magnetic buttons, custom cursor that becomes a "View" label over product cards.
- Page transitions: a fast ink-colour panel wipe with the page title.
- Nothing bounces, nothing spins without purpose. Motion must explain the product.

## 6. Pages

### Home

1. **Hero** — full-viewport. A single photoreal 3D PET preform floats, slowly rotating, light refracting through it. Headline (example): "Precision in every preform." Sub-line on capacity and range. One primary CTA "Explore preforms", one text link "Request a quote". Scroll cue.
2. **Scroll story (pinned)** — the preform rotates as the user scrolls through 3–4 statements: neck-finish accuracy, gram-weight range, material clarity, consistency at scale. Each statement in large type with a mono spec line.
3. **Range at a glance** — horizontal scroll rail of real preform photos grouped by neck finish (e.g. 28mm PCO 1810/1881, 30/25, 38mm, 46mm, 48mm, wide-mouth jar). Hover shows gram weight + application.
4. **Industries served** — editorial split layout with real photos: Packaged water, Carbonated drinks, Juices & dairy, Edible oil, Pharma, Personal & home care.
5. **Manufacturing** — dark section, full-bleed factory/machine video or photo with parallax. Short copy on machines, automation, clean-room handling.
6. **Quality** — QC lab photography, certifications (ISO etc. — client to confirm), process steps as a numbered horizontal timeline.
7. **Clients / trust** — logo strip in monochrome (placeholder slots, client to supply).
8. **CTA band** — "Tell us your neck finish and gram weight. We'll send a quote within 24 hours." with enquiry button.
9. **Footer** — sitemap, address, phone, email, WhatsApp, GST/company details, social links.

### About Us

1. Hero: large statement on who Metco Polypet is, with a wide factory photograph.
2. Story timeline: founding year to today, milestones as pinned horizontal scroll.
3. Numbers (only real, client-supplied figures: capacity, years, machines, clients) set in huge type.
4. Infrastructure: machine park, moulds, resin sourcing, warehousing — photo grid with captions.
5. Quality & certifications.
6. Leadership / team (photo slots).
7. Sustainability: rPET readiness, lightweighting, recycling.
8. CTA.

### Products

1. Hero: lineup of real preform photographs arranged by size, shot on black.
2. **Filterable catalogue**: filter by neck finish, gram weight range, application, colour. Each card: real photo, name, neck finish, weight (g), height (mm), application, colour options.
3. **Product detail (template, can be a modal or sub-page `/products/[slug]`)**: large photo + optional 3D viewer, full spec table in mono (neck finish, weight, body length, wall thickness, material grade, colours, MOQ, packing), downloadable spec PDF, "Request quote for this preform" CTA prefilled with the product.
4. Custom development section: "Need a custom preform?" — mould development process.
5. FAQ (also used for AEO).

### Contact Us

1. Large headline and direct details first: phone, email, WhatsApp, address, working hours.
2. Enquiry form: name, company, email, phone, product/neck finish, gram weight, monthly quantity, message, file upload. Inline validation, clear success state.
3. Embedded map of the plant location.
4. Separate contacts for Sales / Exports / Careers.

## 7. Navigation

- Minimal fixed header: logo left, 4 links + "Get a quote" button right. Header hides on scroll down, returns on scroll up, gains a subtle blurred background over content.
- Mobile: full-screen menu with large staggered link reveal.
- Fully responsive: 375, 768, 1024, 1440, 1920.

## 8. SEO, AEO, AIO & GEO requirements

- Semantic HTML5: one `<h1>` per page, logical H2/H3 hierarchy, `<main>`, `<nav>`, `<article>`, `<section>` with headings.
- Unique `<title>` (≤60 chars) and meta description (≤155 chars) per page, targeting terms like "PET preform manufacturer", "28mm PCO preforms", "PET preforms for water bottles", plus location (city/state/India).
- Open Graph + Twitter cards with real product images.
- **JSON-LD structured data**: `Organization`, `LocalBusiness`/`Manufacturer`, `WebSite` with `SearchAction`, `BreadcrumbList`, `Product` (with specs as `additionalProperty`) for every preform, `FAQPage` for FAQs, `ContactPage`.
- Clean URLs: `/`, `/about`, `/products`, `/products/28mm-pco-1881-18g`, `/contact`.
- `sitemap.xml`, `robots.txt`, canonical tags, `hreflang` if multilingual.
- All text rendered server-side (no content hidden behind JS or canvas). The 3D scene is decorative; product info always exists as real HTML text.
- Every image: descriptive `alt`, WebP/AVIF, explicit width/height, `next/image`.
- **AEO / AIO / GEO**: each page has a short, factual answer block near the top (2–3 sentences answering "what does Metco Polypet make / where / for whom"); FAQ sections written as direct question-and-answer pairs; spec tables in plain HTML `<table>`; consistent company name, address and phone (NAP) everywhere; an `/llms.txt` file summarising the company and products; author/company "about" signals and dates on updated content.
- Accessibility WCAG 2.2 AA: 4.5:1 contrast, visible focus states, keyboard navigable, ARIA only where needed.

## 9. Copy tone

Confident, precise, short. Engineering language, not marketing fluff. Numbers and specs over adjectives. No "revolutionary", "cutting-edge", "world-class". Use placeholder copy only where the client must supply facts, and mark it clearly.

## 10. Deliverables

High-fidelity designs for all four pages (desktop + mobile), the product detail template, header/footer, form states, and a short motion spec per section describing what animates and on what trigger.
