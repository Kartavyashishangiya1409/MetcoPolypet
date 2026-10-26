import { site, mapSrc } from '@/content/site';
import { departments } from '@/content/contact';
import { SplitLines } from '@/components/motion/SplitLines';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { fade } from '@/components/motion/attrs';
import { PreformImage } from '@/components/ui/PreformImage';
import t from '@/components/ui/tone.module.scss';
import { EnquiryForm } from './EnquiryForm';
import s from './Contact.module.scss';

export function ContactHero() {
  return (
    <section aria-labelledby="contact-h1" className={s.hero}>
      <span {...fade(true)} className={s.eyebrow}>
        Contact
      </span>
      <SplitLines
        as="h1"
        id="contact-h1"
        now
        className={s.h1}
        lines={["Let's talk", <span key="p" className={t.grey}>preforms.</span>]}
      />
      <address className={s.address}>
        <dl {...fade(true)} className={s.details}>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>
            </dd>
          </div>
          <div>
            <dt>WhatsApp</dt>
            <dd>
              <a href={site.whatsapp.href} target="_blank" rel="noopener">
                {site.whatsapp.label}
              </a>
            </dd>
          </div>
          <div>
            <dt>Plant</dt>
            <dd className={s.plant}>
              {site.address.street}
              <br />
              {site.address.cityLine}
              <br />
              <span className={s.hours}>{site.hours.display}</span>
            </dd>
          </div>
        </dl>
      </address>
      <ClipReveal now className={s.banner}>
        <PreformImage
          id="contact-trio"
          alt="Three Metco Polypet PET preforms"
          sizes="(min-width: 1440px) 1328px, 100vw"
        />
      </ClipReveal>
    </section>
  );
}

export function QuoteSection() {
  return (
    <section aria-labelledby="form-h" className={s.quote}>
      <div className={s.quoteIntro}>
        <h2 id="form-h" className={s.h2}>
          Request a quote
        </h2>
        <p className={s.quoteText}>
          Include the neck finish, gram weight and monthly volume. Our sales team replies within one
          working day.
        </p>
        <ClipReveal className={s.map}>
          <iframe
            title="Metco Polypet plant location"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={s.mapFrame}
          />
        </ClipReveal>
      </div>
      <div>
        <EnquiryForm />
      </div>
    </section>
  );
}

export function Departments() {
  return (
    <section aria-label="Departments" className={s.depts}>
      <div className={s.deptGrid}>
        {departments.map((d) => (
          <div key={d.t} {...fade()} className={s.dept}>
            <h3 className={s.deptT}>{d.t}</h3>
            <p className={s.deptD}>{d.d}</p>
            <a href={`mailto:${d.e}`} className={s.deptE}>
              {d.e}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
