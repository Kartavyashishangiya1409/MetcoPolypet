import { type Product, specRows, specSheetHref } from '@/content/products';
import { site } from '@/content/site';
import { PreformImage } from '@/components/ui/PreformImage';
import { SpecTable } from '@/components/ui/SpecTable';
import { ButtonLink } from '@/components/ui/Button';
import s from './ProductDetail.module.scss';

type Props = {
  product: Product;
  /** h2 inside the catalogue modal, h1 on the standalone page */
  as?: 'h1' | 'h2';
  headingId?: string;
  /** Close control (modal only) */
  close?: React.ReactNode;
  /** Short factual answer block under the heading (standalone page) */
  summary?: string;
};

/** Macro image + spec table + quote CTA — the design's product detail panel. */
export function ProductDetail({
  product: p,
  as: Heading = 'h2',
  headingId,
  close,
  summary,
}: Props) {
  const pdf = specSheetHref(p);
  const specHref =
    pdf ??
    `mailto:${site.email.sales}?subject=${encodeURIComponent(`Spec sheet request: ${p.name}`)}`;

  return (
    <div className={s.panel}>
      <div className={s.media}>
        <PreformImage
          id={`macro-${p.id}`}
          alt={`${p.name} neck finish`}
          sizes="(min-width: 900px) 600px, 100vw"
          priority
        />
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <span className={s.app}>{p.app}</span>
          {close}
        </div>
        <Heading id={headingId} className={s.name}>
          {p.name}
        </Heading>
        {summary && <p className={s.summary}>{summary}</p>}
        <SpecTable rows={specRows(p)} caption={`${p.name} specifications`} />
        <div className={s.actions}>
          <ButtonLink href={`/contact?product=${p.slug}`}>
            Request quote for this preform →
          </ButtonLink>
          <a href={specHref} className={s.spec} {...(pdf ? { download: true } : {})}>
            Spec sheet (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
