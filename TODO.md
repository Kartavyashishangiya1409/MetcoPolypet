# TODO — content the client must supply

Every value below is shown on the site in `[square brackets]` so it can't be mistaken for real
data. Edit the file listed, then redeploy. Nothing else needs to change: NAP (name, address,
phone) flows from `content/site.ts` into the header menu, footer, contact page, JSON-LD and
`/llms.txt`.

## Company details — `content/site.ts`

| Field                     | Placeholder                                          | Used in                                                        |
| ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| Legal name suffix         | `Metco Polypet [Pvt. Ltd.]`                          | Footer, JSON-LD `legalName`, llms.txt                          |
| Phone (display + `tel`)   | `+91 [00000 00000]` / `+910000000000`                | Menu, footer, contact, JSON-LD                                 |
| WhatsApp link             | `https://wa.me/910000000000`                         | Contact "Message us" (derived from phone; change if different) |
| Street                    | `[Plot no., Industrial area]`                        | Contact, JSON-LD address                                       |
| City / State / PIN        | `[City]`, `[State]`, `[PIN]` (+ `short`, `cityLine`) | Footer, contact, About copy, JSON-LD                           |
| Plant coordinates         | `geo: null`                                          | Map embed (shows India until set)                              |
| GSTIN                     | `[00XXXXX0000X0X0]`                                  | Footer (added to JSON-LD `taxID` once real)                    |
| Founding year             | `[Year]`                                             | About copy (added to JSON-LD `foundingDate` once real)         |
| LinkedIn / IndiaMART URLs | empty `href`                                         | Footer (rendered as plain text until set), JSON-LD `sameAs`    |

## Figures, history, certifications, people — `content/about.ts`

- Key figures: `[00]` years in operation, `[00]` injection moulding machines, `[00] M` preforms per month, `[000]+` active clients
- Milestones: four `[Year]` values and their `[...]` descriptions
- Infrastructure: `[Number]` machines
- Certifications: ISO 9001:2015 `[Confirm]`, FSSC 22000 / ISO 22000 `[Confirm]` — remove any the company doesn't hold
- Leadership: three `[Name]` values (roles are already set)

## Other copy

- `content/home.ts` — story step 04: `[capacity]` preforms per day
- `content/faqs.ts` — `[MOQ]` pieces; `Do you deliver outside [State]?`; `[and export to — confirm]`

## Photography & assets still needed

- [ ] **Leadership portraits** (3, 4:3) — replace the placeholder preform renders in `components/about/AboutSections.tsx` (`Leadership`)
- [ ] **Client logos** (monochrome SVG, ~5) — replace the `[Client logo]` slots in `components/home/HomeSections.tsx` (`Clients`)
- [ ] **Spec sheet PDFs** per product — add to `public/spec-sheets/` and map them in `SPEC_SHEETS` in `content/products.ts` (until then the link emails sales)
- [ ] _Optional:_ real plant photography (machines, mould shop, QC lab, warehouse, factory floor) to replace or sit alongside the 3D renders in About › Infrastructure and Home › Manufacturing

## Before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM` in Vercel
- [ ] Verify the sending domain in Resend
- [ ] Submit `https://www.metcopolypet.com/sitemap.xml` in Google Search Console
