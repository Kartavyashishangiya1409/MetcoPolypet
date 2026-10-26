import { story } from '@/content/home';
import { PreformImage } from '@/components/ui/PreformImage';
import s from './Story.module.scss';

/** 420vh section with a sticky 100vh stage; four text/image pairs cross-fade on scroll. */
export function Story() {
  return (
    <section data-story="" aria-label="What sets our preforms apart" className={s.story}>
      <div className={s.stage}>
        <div className={s.grid}>
          <div className={s.textCol}>
            <div className={s.track}>
              <div data-story-bar="" className={s.bar} />
            </div>
            <div className={s.items}>
              {story.map((it) => (
                <div key={it.n} data-story-item="" className={s.item}>
                  <span className={s.count}>{it.n} / 04</span>
                  <h2 className={s.title}>{it.title}</h2>
                  <p className={s.spec}>{it.spec}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={s.media}>
            {story.map((it, i) => (
              <div key={it.n} data-story-img="" className={s.img}>
                <PreformImage
                  id={`story-${i + 1}`}
                  alt={it.title}
                  sizes="(min-width: 760px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
