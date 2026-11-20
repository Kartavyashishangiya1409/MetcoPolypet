import { SplitLines } from '@/components/motion/SplitLines';
import { fade, ink } from '@/components/motion/attrs';
import { ButtonLink } from '@/components/ui/Button';
import t from '@/components/ui/tone.module.scss';
import s from './HomeSections.module.scss';

/** Short factual answer block (AEO): what Metco Polypet makes, where, for whom. */
export function InBrief() {
  return (
    <section aria-label="About Metco Polypet in brief" className={s.brief}>
      <div className={s.briefGrid}>
        <span {...fade()} className={s.eyebrow}>
          In brief
        </span>
        <p {...fade()} {...ink} className={s.briefText}>
          Metco Polypet is an Indian manufacturer of PET preforms. We supply bottlers and brand
          owners with 28 mm PCO 1881 preforms from 9.5 g to 18 g,{' '}
          <span className={t.grey}>
            moulded from food-grade resin and checked against closure specifications before
            dispatch.
          </span>
        </p>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section aria-labelledby="cta-h" className={s.cta}>
      <SplitLines
        id="cta-h"
        className={s.ctaH}
        lines={[
          'Tell us the neck finish',
          'and gram weight.',
          <span key="q" className={t.grey}>
            We&apos;ll send a quote.
          </span>,
        ]}
      />
      <span {...fade()}>
        <ButtonLink href="/contact" size="lg">
          Start an enquiry <span aria-hidden="true">→</span>
        </ButtonLink>
      </span>
    </section>
  );
}
