import { processSteps } from '@/content/home';
import { SplitLines } from '@/components/motion/SplitLines';
import { fade } from '@/components/motion/attrs';
import s from './Process.module.scss';

export function Process() {
  return (
    <section aria-labelledby="q-h" className={s.section}>
      <div className={s.head}>
        <SplitLines id="q-h" className={s.h2} lines={['From resin', 'to carton.']} />
        <p {...fade()} className={s.copy}>
          Five controlled stages. Every batch is traceable to its resin lot, machine and shift.
        </p>
      </div>
      <ol className={s.steps}>
        {processSteps.map((p) => (
          <li key={p.n} {...fade()} className={s.step}>
            <span className={s.n}>{p.n}</span>
            <div className={s.body}>
              <h3 className={s.name}>{p.name}</h3>
              <p className={s.text}>{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
