import { necks } from '@/content/home';
import { PreformImage } from '@/components/ui/PreformImage';
import { TransitionLink } from '@/components/layout/TransitionLink';
import t from '@/components/ui/tone.module.scss';
import s from './RangeRail.module.scss';

/** 320vh section; the horizontal track moves by scrollWidth − clientWidth as you scroll. */
export function RangeRail() {
  return (
    <section data-rail="" aria-labelledby="range-h" className={s.rail}>
      <div className={s.stage}>
        <div className={s.head}>
          <h2 id="range-h" className={s.h2}>
            The range,
            <br />
            <span className={t.darkGrey}>by neck finish.</span>
          </h2>
          <TransitionLink href="/products" className={s.link}>
            View full catalogue →
          </TransitionLink>
        </div>
        <div data-rail-track="" className={s.track}>
          {necks.map((k) => (
            <article key={k.id} className={s.card}>
              <div className={s.media}>
                <PreformImage id={`rail-${k.id}`} alt={`${k.name} PET preform`} sizes="380px" />
              </div>
              <div className={s.row}>
                <h3 className={s.name}>{k.name}</h3>
                <span className={s.range}>{k.range}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
