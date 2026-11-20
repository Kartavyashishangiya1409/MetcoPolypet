// /llms.txt — plain-text summary for AI assistants and answer engines (llmstxt.org format).
// Generated from content/* at build time so NAP and product data never drift from the site.
import { site, absoluteUrl } from '@/content/site';
import { products, MATERIAL } from '@/content/products';
import { industries } from '@/content/home';
import { faqs } from '@/content/faqs';
import { departments } from '@/content/contact';

export const dynamic = 'force-static';

export function GET() {
  const a = site.address;
  const body = `# ${site.name}

> ${site.name} is an Indian manufacturer of injection-moulded PET preforms. It supplies bottlers and brand owners with 28 mm PCO 1881 preforms from 9.5 g to 18 g, moulded from food-grade resin and checked against closure specifications before dispatch.

## Company

- Name: ${site.legalName}
- What it makes: PET preforms and the moulds behind them; custom preform development (design, mould, sampling)
- Material: ${MATERIAL} (virgin resin; rPET blends where food-contact regulations allow)
- Plant: ${a.street}, ${a.city}, ${a.region} ${a.postalCode}, ${a.country}
- Hours: ${site.hours.display}
- Phone: ${site.phone.display}
${departments.map((d) => `- Email (${d.t.toLowerCase()}): ${d.e}`).join('\n')}

## Industries served

${industries.map((i) => `- ${i.name} — neck finishes ${i.necks}`).join('\n')}

## Product range

| Preform | Neck finish | Weight | Height | Bottle volume | Application | Colours |
|---|---|---|---|---|---|---|
${products.map((p) => `| [${p.name}](${absoluteUrl(`/products/${p.slug}`)}) | ${p.neck} | ${p.w} | ${p.h} | ${p.vol} | ${p.app} | ${p.colours} |`).join('\n')}

Dimensions are indicative; final specifications are confirmed on the quotation. Custom preforms are designed to the customer's bottle drawing or sample.

## FAQ

${faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Pages

- [Home](${absoluteUrl('/')}): overview, range by neck finish, industries, manufacturing process
- [About](${absoluteUrl('/about')}): company, infrastructure, quality and certifications, leadership
- [Products](${absoluteUrl('/products')}): full catalogue with specifications and FAQ
- [Contact](${absoluteUrl('/contact')}): request a quote, plant address, departments
- [Sitemap](${absoluteUrl('/sitemap.xml')})

Note: values shown in [square brackets] are placeholders pending confirmation by the company.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
