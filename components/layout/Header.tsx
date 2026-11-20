'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/content/site';
import { lockScroll } from '@/lib/lenis';
import { liquidGlassMap, supportsLiquidGlass } from '@/lib/liquid-glass';
import { TransitionLink } from './TransitionLink';
import { useNav } from './PageTransition';
import s from './Header.module.scss';

// Vertical centre of the floating capsule (12px gap + 56px capsule)
const CAPSULE_MID = 40;

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);

export function Header() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useNav();
  // Whether the page right behind the bar is dark (light text + dark glass). The SSR guess covers
  // the dark products hero so it doesn't flash.
  const [overDark, setOverDark] = useState(pathname === '/products');
  // Lens map for the liquid-glass filter (Chromium with a mouse/trackpad only; elsewhere the
  // capsule is frosted glass with the same highlights).
  const [lens, setLens] = useState<{ w: number; h: number; href: string } | null>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // On every scroll (once per frame) check what's behind the capsule.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setOverDark(isDarkBehindHeader());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Rebuild the lens map whenever the capsule changes size.
  useEffect(() => {
    const el = capsuleRef.current;
    if (!el || !supportsLiquidGlass() || !matchMedia('(pointer: fine)').matches) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setLens((prev) =>
        prev && prev.w === w && prev.h === h ? prev : { w, h, href: liquidGlassMap(w, h) },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const cls = [s.header, overDark && !menuOpen ? s.onDark : ''].join(' ');

  return (
    <>
      {lens && (
        <svg aria-hidden="true" width="0" height="0" className={s.lensDefs}>
          <filter
            id="liquid-glass"
            x="0"
            y="0"
            width={lens.w}
            height={lens.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={lens.href}
              x="0"
              y="0"
              width={lens.w}
              height={lens.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="36"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
      <header className={cls}>
        <div ref={capsuleRef} className={`${s.inner} ${lens ? s.lens : ''}`}>
          <TransitionLink href="/" aria-label="Metco Polypet home" className={s.logo}>
            {/* Pre-sized WebP at 1x/2x/3x (next/image optimisation is off site-wide) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={s.mark}
              src="/images/brand/metco-icon-36.webp"
              srcSet="/images/brand/metco-icon-72.webp 2x, /images/brand/metco-icon-108.webp 3x"
              width={36}
              height={36}
              alt=""
            />
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
            className={`${s.menuBtn} ${menuOpen ? s.open : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={s.bars} aria-hidden="true">
              <span />
              <span />
            </span>
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

/**
 * Samples the page at the middle of the capsule (skipping the header itself and the page-transition
 * panel) and walks up to the first opaque background: dark if its luminance is below 0.3.
 */
function isDarkBehindHeader(): boolean {
  const hit = document
    .elementsFromPoint(window.innerWidth / 2, CAPSULE_MID)
    .find((el) => el.closest('#main, #site-footer'));
  for (let el = hit ?? null; el; el = el.parentElement) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (!m || (m[3] !== undefined && Number(m[3]) < 0.5)) continue;
    const [r, g, b] = m.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.3;
  }
  return false;
}
