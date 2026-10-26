import { nav, site } from '@/content/site';
import { TransitionLink } from './TransitionLink';
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

        <svg viewBox="0 0 1000 150" aria-hidden="true" className={s.wordmark}>
          <text x="500" y="118" textAnchor="middle" textLength="1000" lengthAdjust="spacingAndGlyphs">
            {site.name}
          </text>
        </svg>

        <div className={s.legal}>
          <span>
            © {site.copyrightYear} {site.legalName} · GSTIN {site.gstin}
          </span>
          <span>
            {site.socials.map((so, i) => (
              <span key={so.label}>
                {i > 0 && ' · '}
                {so.href ? (
                  <a href={so.href} rel="noopener" target="_blank">
                    {so.label}
                  </a>
                ) : (
                  so.label
                )}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
