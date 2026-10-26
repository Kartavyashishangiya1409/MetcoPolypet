import { customSteps } from '@/content/products';
import { faqs } from '@/content/faqs';
import { SplitLines } from '@/components/motion/SplitLines';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { fade } from '@/components/motion/attrs';
import { PreformImage } from '@/components/ui/PreformImage';
import { ButtonLink } from '@/components/ui/Button';
import { Faq } from '@/components/ui/Faq';
import t from '@/components/ui/tone.module.scss';
import s from './Products.module.scss';

export function ProductsHero() {
  return (
    <section aria-labelledby="prod-h1" className={s.hero}>
      <div className={s.heroCopy}>
        <span {...fade(true)} className={s.eyebrow}>
          Products
        </span>
        <SplitLines
          as="h1"
          id="prod-h1"
          now
          className={s.h1}
          lines={['PET preforms,', <span key="e" className={t.darkGrey}>every size.</span>]}
        />
        <p {...fade(true)} className={s.lede}>
          Standard preforms from 20 mm to 63 mm neck finishes and 6 g to 85 g, in clear, tinted and
          opaque colours. Custom designs on request.
        </p>
      </div>
      <div className={s.bannerWrap}>
        <ClipReveal now className={s.banner}>
          <PreformImage
            id="products-lineup"
            alt="PET preform lineup"
            sizes="(min-width: 1440px) 1328px, 100vw"
          />
        </ClipReveal>
      </div>
    </section>
  );
}

export function CustomPreform() {
  return (
    <section aria-labelledby="custom-h" className={s.custom}>
      <div className={s.customGrid}>
        <div className={s.customIntro}>
          <SplitLines
            id="custom-h"
            className={s.h2}
            lines={['Need a', <span key="c" className={t.darkGrey}>custom preform?</span>]}
          />
          <p {...fade()} className={s.customText}>
            Send us your bottle drawing or a sample. We design the preform, build the mould and run
            trials with you before production.
          </p>
          <span {...fade()} className={s.customCta}>
            <ButtonLink href="/contact" variant="light">
              Discuss a design →
            </ButtonLink>
          </span>
        </div>
        <ol className={s.steps}>
          {customSteps.map((c) => (
            <li key={c.n} {...fade()} className={s.step}>
              <span className={s.stepN}>{c.n}</span>
              <div className={s.stepBody}>
                <h3 className={s.stepT}>{c.t}</h3>
                <p className={s.stepD}>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProductFaq() {
  return (
    <section aria-labelledby="faq-h" className={s.faq}>
      <h2 id="faq-h" className={s.faqH}>
        Questions buyers ask
      </h2>
      <Faq items={faqs} />
    </section>
  );
}
