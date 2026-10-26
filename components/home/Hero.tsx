import { preload } from 'react-dom';
import { SplitLines } from '@/components/motion/SplitLines';
import { fade } from '@/components/motion/attrs';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { HERO_POSTER, heroPosterPath } from '@/content/preform-images';
import t from '@/components/ui/tone.module.scss';
import { HeroStage } from './HeroStage';
import s from './Hero.module.scss';

const SIZES = '(max-width: 520px) 470px, 620px';
const srcSet = (ext: 'avif' | 'webp') =>
  HERO_POSTER.widths.map((w) => `${heroPosterPath(w, ext)} ${w}w`).join(', ');

export function Hero() {
  // The poster is the LCP element: preload the AVIF set at high priority.
  preload(heroPosterPath(1122, 'avif'), {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: srcSet('avif'),
    imageSizes: SIZES,
    fetchPriority: 'high',
  });

  return (
    <section aria-labelledby="home-h1" className={s.hero}>
      <div className={s.grid}>
        <div className={s.copy}>
          <span {...fade(true)} className={s.eyebrow}>
            PET preform manufacturer · India
          </span>
          <SplitLines
            as="h1"
            id="home-h1"
            now
            className={s.h1}
            lines={[
              'Precision',
              'in every',
              <span key="p" className={t.accent}>
                preform.
              </span>,
            ]}
          />
          <p {...fade(true)} className={s.lede}>
            Injection-moulded PET preforms for water, soft drinks, juice, edible oil, pharma and
            personal care. Every neck finish, every gram weight, made to your closure spec.
          </p>
          <div {...fade(true)} className={s.ctas}>
            <ButtonLink href="/products">
              Explore preforms <span aria-hidden="true">→</span>
            </ButtonLink>
            <TextLink href="/contact">Request a quote</TextLink>
          </div>
        </div>

        <div data-hero-obj="" className={s.obj}>
          <div data-hero-intro="" className={s.intro}>
            <HeroStage label="Clear 28 mm PET preform by Metco Polypet, drag to rotate">
              <picture>
                <source type="image/avif" srcSet={srcSet('avif')} sizes={SIZES} />
                <img
                  className={s.poster}
                  src={heroPosterPath(700, 'webp')}
                  srcSet={srcSet('webp')}
                  sizes={SIZES}
                  width={HERO_POSTER.width}
                  height={HERO_POSTER.height}
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </HeroStage>
          </div>
        </div>
      </div>

      <div className={s.specWrap}>
        <dl {...fade(true)} className={s.specs}>
          <div>
            <dt>Neck finishes</dt>
            <dd>20 – 63 mm</dd>
          </div>
          <div>
            <dt>Gram weights</dt>
            <dd>6 – 85 g</dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd>Food-grade PET</dd>
          </div>
          <div className={s.scrollCue}>
            <dt>Scroll</dt>
            <dd aria-hidden="true">↓</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
