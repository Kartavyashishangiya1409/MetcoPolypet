import { SplitLines } from '@/components/motion/SplitLines';
import { Parallax } from '@/components/motion/Parallax';
import { fade } from '@/components/motion/attrs';
import { PreformImage } from '@/components/ui/PreformImage';
import s from './Manufacturing.module.scss';

export function Manufacturing() {
  return (
    <section aria-labelledby="mfg-h" className={s.section}>
      <Parallax className={s.layer}>
        <PreformImage id="manufacturing" alt="PET preforms" sizes="100vw" />
      </Parallax>
      <div className={s.shade} />
      <div className={s.bottom}>
        <div className={s.grid}>
          <SplitLines id="mfg-h" className={s.h2} lines={['Built on the', 'factory floor.']} />
          <p {...fade()} className={s.copy}>
            Hot-runner multi-cavity moulds, automated resin drying and handling, and closed packing
            lines keep preforms clean from hopper to carton.
          </p>
        </div>
      </div>
    </section>
  );
}
