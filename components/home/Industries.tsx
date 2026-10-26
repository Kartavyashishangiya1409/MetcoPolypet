import { industries } from '@/content/home';
import { SplitLines } from '@/components/motion/SplitLines';
import { fade } from '@/components/motion/attrs';
import { PreformImage } from '@/components/ui/PreformImage';
import t from '@/components/ui/tone.module.scss';
import s from './Industries.module.scss';

export function Industries() {
  return (
    <section aria-labelledby="ind-h" className={s.section}>
      <div className={s.grid}>
        <div className={s.intro}>
          <span {...fade()} className={s.eyebrow}>
            Industries
          </span>
          <SplitLines
            id="ind-h"
            className={s.h2}
            lines={[
              'Six markets.',
              <span key="o" className={t.grey}>
                One standard.
              </span>,
            ]}
          />
        </div>
        <ul className={s.list}>
          {industries.map((i) => (
            <li key={i.n} {...fade()} className={s.item}>
              <span className={s.n}>{i.n}</span>
              <div className={s.body}>
                <h3 className={s.name}>{i.name}</h3>
                <span className={s.necks}>{i.necks}</span>
              </div>
              <div className={s.thumb}>
                <PreformImage id={`industry-${i.id}`} alt={`${i.name} preform`} sizes="96px" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
