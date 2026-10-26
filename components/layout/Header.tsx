'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/content/site';
import { lockScroll } from '@/lib/lenis';
import { TransitionLink } from './TransitionLink';
import { useNav } from './PageTransition';
import s from './Header.module.scss';

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

export function Header() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useNav();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Pages that open on a dark hero mark it with [data-header-dark]; the SSR guess avoids a flash.
  const [darkTop, setDarkTop] = useState(pathname === '/products');
  const lastY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down after 160px, return on scroll up; blurred background after 20px.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 160);
      setScrolled(y > 20);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDarkTop(!!document.querySelector('main [data-header-dark]'));
  }, [pathname]);

  // Mobile menu: lock scroll, make the page inert, Esc closes, focus moves into the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const outside = [document.getElementById('main'), document.getElementById('site-footer')];
    lockScroll(true);
    outside.forEach((el) => el?.setAttribute('inert', ''));
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 860) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      lockScroll(false);
      outside.forEach((el) => el?.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen, setMenuOpen]);

  const cls = [
    s.header,
    hidden && !menuOpen ? s.hidden : '',
    scrolled || menuOpen ? s.filled : '',
    scrolled ? s.lined : '',
    darkTop && !scrolled && !menuOpen ? s.onDark : '',
  ].join(' ');

  return (
    <>
      <header className={cls}>
        <div className={s.inner}>
          <TransitionLink href="/" aria-label="Metco Polypet home" className={s.logo}>
            <span className={s.mark} aria-hidden="true">
              <span />
            </span>
            <span className={s.word}>{site.name}</span>
          </TransitionLink>

          <nav aria-label="Primary" className={s.nav}>
            {nav.map((n) => (
              <TransitionLink
                key={n.href}
                href={n.href}
                className={isActive(pathname, n.href) ? s.active : undefined}
                aria-current={isActive(pathname, n.href) ? 'page' : undefined}
              >
                {n.label}
              </TransitionLink>
            ))}
          </nav>
          <TransitionLink href="/contact" className={s.cta}>
            Get a quote
          </TransitionLink>

          <button
            ref={buttonRef}
            type="button"
            className={s.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className={s.menu}>
          <nav aria-label="Mobile" className={s.menuNav}>
            {nav.map((n) => (
              <TransitionLink
                key={n.href}
                href={n.href}
                aria-current={isActive(pathname, n.href) ? 'page' : undefined}
              >
                {n.label}
              </TransitionLink>
            ))}
          </nav>
          <div className={s.menuMeta}>
            <a href={`mailto:${site.email.sales}`}>{site.email.sales}</a>
            <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
          </div>
        </div>
      )}
    </>
  );
}
