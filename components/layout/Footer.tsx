import { nav, site } from '@/content/site';
import { TransitionLink } from './TransitionLink';
import { Wordmark } from './Wordmark';
import s from './Footer.module.scss';

export function Footer() {
  return (
    <footer id="site-footer" className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>
          <div className={s.lead}>
            <span className={s.tagline}>{site.tagline}</span>
            <TransitionLink href="/contact" className={s.quote}>
              Request a quote →
            </TransitionLink>
          </div>
          <nav aria-label="Footer" className={s.col}>
            <span className={s.label}>Site</span>
            {nav.map((n) => (
              <TransitionLink key={n.href} href={n.href}>
                {n.label}
              </TransitionLink>
            ))}
          </nav>
          <address className={s.col}>
            <span className={s.label}>Contact</span>
            <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>
            <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
            <span className={s.muted}>{site.address.short}</span>
          </address>
        </div>

        <Wordmark text={site.name} />

        <div className={s.legal}>
          <span>
            © {site.copyrightYear} {site.legalName}
          </span>
          <span className={s.socials}>
            {site.socials.map((so) =>
              so.href ? (
                <a
                  key={so.label}
                  href={so.href}
                  rel="noopener"
                  target="_blank"
                  aria-label={so.label}
                >
                  <InstagramIcon />
                </a>
              ) : (
                <span key={so.label} role="img" aria-label={so.label}>
                  <InstagramIcon />
                </span>
              ),
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
