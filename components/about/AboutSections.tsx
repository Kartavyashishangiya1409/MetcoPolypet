import { figures, milestones, infrastructure, certifications, team } from '@/content/about';
import { site } from '@/content/site';
import { SplitLines } from '@/components/motion/SplitLines';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { fade, ink } from '@/components/motion/attrs';
import { PreformImage } from '@/components/ui/PreformImage';
import t from '@/components/ui/tone.module.scss';
import s from './About.module.scss';

export function AboutHero() {
  return (
    <>
      <section aria-labelledby="about-h1" className={s.hero}>
        <span {...fade(true)} className={s.eyebrow}>
          About Metco Polypet
        </span>
        <SplitLines
          as="h1"
          id="about-h1"
          now
          className={s.h1}
          lines={[
            'We make the part',
            'every bottle',
            <span key="s" className={t.grey}>
              starts from.
            </span>,
          ]}
        />
      </section>
      <div className={s.bannerWrap}>
        <ClipReveal now className={s.banner}>
          <PreformImage
            id="about-lineup"
            alt="Metco Polypet PET preform range"
            sizes="(min-width: 1440px) 1328px, 100vw"
          />
        </ClipReveal>
      </div>
    </>
  );
}

export function WhoWeAre() {
  return (
    <section aria-label="About in brief" className={s.brief}>
      <span {...fade()} className={s.eyebrow}>
        Who we are
      </span>
      <div className={s.briefBody}>
        <p {...fade()} {...ink} className={s.briefLead}>
          Metco Polypet has manufactured PET preforms in {site.address.city}, India since{' '}
          {site.foundingYear}. We serve bottlers of water, soft drinks, juice and dairy products.
        </p>
        <p {...fade()} className={s.briefText}>
          Our work is narrow on purpose. We make preforms and the moulds behind them, and we spend
          our time on the details buyers care about: neck dimensions that seal, weights that stay
          consistent, and deliveries that arrive when lines need them.
        </p>
      </div>
    </section>
  );
}

export function VisionMission() {
  return (
    <section aria-label="Our Vision and Mission" className={s.vm}>
      <div className={s.vmGrid}>
        <div {...fade()} className={s.vmCard}>
          <span className={s.vmEyebrow}>Our Vision</span>
          <h2 className={s.vmHeading}>To be India&rsquo;s most trusted name in PET preforms.</h2>
          <p className={s.vmText}>
            We envision a future where every bottle starts with a preform engineered for
            perfection &mdash; lightweight, consistent, and produced with minimal environmental
            impact. Metco Polypet aims to set the benchmark for quality and reliability that
            bottlers across the country can depend on.
          </p>
        </div>
        <div {...fade()} className={s.vmCard}>
          <span className={s.vmEyebrow}>Our Mission</span>
          <h2 className={s.vmHeading}>Precision in every preform, promise in every delivery.</h2>
          <p className={s.vmText}>
            Our mission is to deliver PET preforms that meet the highest standards of dimensional
            accuracy, material integrity, and food safety. We invest in advanced moulding
            technology, rigorous quality control, and a team culture of continuous improvement
            &mdash; so our customers can bottle with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Figures() {
  return (
    <section aria-label="Key figures" className={s.figures}>
      <div className={s.figuresGrid}>
        {figures.map((f) => (
          <div key={f.k} {...fade()} className={s.figure}>
            <span className={s.figureV}>{f.v}</span>
            <span className={s.figureK}>{f.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Milestones() {
  return (
    <section aria-labelledby="story-h" className={s.section}>
      <SplitLines id="story-h" className={`${s.h2} ${s.h2Gap}`} lines={['How we got here.']} />
      <ol className={s.milestones}>
        {milestones.map((m, i) => (
          <li key={i} {...fade()} className={s.milestone}>
            <span className={s.year}>{m.y}</span>
            <h3 className={s.h3}>{m.t}</h3>
            <p className={s.mDesc}>{m.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Infrastructure() {
  return (
    <section aria-labelledby="infra-h" className={s.infra}>
      <div className={s.infraHead}>
        <SplitLines id="infra-h" className={s.h2} lines={['Infrastructure.']} />
        <p {...fade()} className={s.side}>
          Everything that touches the preform is under one roof.
        </p>
      </div>
      <div className={s.infraGrid}>
        {infrastructure.map((x) => (
          <figure key={x.id} {...fade()} className={s.infraItem}>
            <div className={s.infraMedia}>
              <PreformImage
                id={`infra-${x.id}`}
                alt={x.t}
                sizes="(min-width: 1440px) 320px, (min-width: 700px) 50vw, 100vw"
              />
            </div>
            <figcaption className={s.caption}>
              <span className={s.captionT}>{x.t}</span>
              <span className={s.captionD}>{x.d}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Quality() {
  return (
    <section aria-labelledby="cert-h" className={s.quality}>
      <div className={s.qualityGrid}>
        <div className={s.qualityIntro}>
          <SplitLines id="cert-h" className={s.h2Sm} lines={['Quality & sustainability']} />
          <p {...fade()} className={s.qualityText}>
            We work with brand owners on lighter preform designs that use less resin per bottle, and
            on rPET blends where food-contact regulations allow. Process scrap is segregated and
            reground under control.
          </p>
        </div>
        <ul className={s.certs}>
          {certifications.map((c) => (
            <li key={c.n} {...fade()} className={s.cert}>
              <span className={s.certN}>{c.n}</span>
              <span className={s.certD}>{c.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Leadership() {
  return (
    <section aria-labelledby="team-h" className={s.team}>
      <SplitLines id="team-h" className={`${s.h2Sm} ${s.teamH}`} lines={['Leadership']} />
      <div className={s.teamGrid}>
        {team.map((m) => (
          <figure key={m.id} {...fade()} className={s.member}>
            {/* Placeholder visual until leadership portraits are supplied (see TODO.md) */}
            <div className={s.portrait}>
              <PreformImage id={`team-${m.id}`} alt="" sizes="(min-width: 1440px) 430px, 100vw" />
            </div>
            <figcaption className={s.memberCap}>
              <span className={s.memberN}>{m.n}</span>
              <span className={s.memberR}>{m.r}</span>
              <span className={s.memberQ}>&ldquo;{m.q}&rdquo;</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
