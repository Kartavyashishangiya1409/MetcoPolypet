'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/components/motion/gsap';
import { initMotion } from '@/components/motion/initMotion';
import { getLenis, scrollToTop } from '@/lib/lenis';
import { transitionLabel } from '@/content/site';
import s from './PageTransition.module.scss';

type Nav = {
  navigate: (href: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const NavContext = createContext<Nav>({
  navigate: () => {},
  menuOpen: false,
  setMenuOpen: () => {},
});

export const useNav = () => useContext(NavContext);

const pathOf = (href: string) => href.split(/[?#]/)[0] || '/';
const pageKey = () =>
  document.querySelector<HTMLElement>('main [data-page]')?.dataset.page ?? location.pathname;

/**
 * Black panel wipe between pages (port of `go()`), plus per-page motion init and scroll reset.
 * Wraps the whole app so links anywhere can trigger it via useNav().navigate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = useRef(false);
  const ctx = useRef<gsap.Context | null>(null);
  const lastKey = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reveal = useCallback(() => {
    clearTimeout(fallback.current);
    const panel = panelRef.current;
    if (!pending.current || !panel) return;
    pending.current = false;
    gsap.to(panel, {
      yPercent: -200,
      duration: 0.85,
      ease: 'expo.inOut',
      delay: 0.12,
      onComplete: () => {
        gsap.set(panel, { yPercent: 0 });
      },
    });
  }, []);

  // (Re)initialise motion whenever the page content changes. Opening the product modal changes
  // the URL but not the page underneath, so it is keyed on [data-page], not the pathname.
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    const key = pageKey();
    const first = lastKey.current === null;
    if (key !== lastKey.current) {
      lastKey.current = key;
      ctx.current?.revert();
      if (!first) scrollToTop(true);
      ctx.current = initMotion(main, first);
    }
    reveal();
  }, [pathname, reveal]);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.current?.revert();
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const target = pathOf(href);
      const panel = panelRef.current;
      if (target === pathname) {
        setMenuOpen(false);
        if (href === target) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        } else router.replace(href, { scroll: false });
        return;
      }
      if (!panel || prefersReducedMotion()) {
        setMenuOpen(false);
        router.push(href);
        return;
      }
      setLabel(transitionLabel(target));
      router.prefetch(href);
      gsap.fromTo(
        panel,
        { yPercent: 0 },
        {
          yPercent: -100,
          duration: 0.65,
          ease: 'expo.inOut',
          onComplete: () => {
            pending.current = true;
            setMenuOpen(false);
            router.push(href, { scroll: false });
            // Never leave the panel covering the page if navigation stalls.
            fallback.current = setTimeout(reveal, 4000);
          },
        },
      );
    },
    [pathname, router, reveal],
  );

  const value = useMemo(() => ({ navigate, menuOpen, setMenuOpen }), [navigate, menuOpen]);

  return (
    <NavContext.Provider value={value}>
      {children}
      <div ref={panelRef} className={s.panel} aria-hidden="true">
        <span className={s.label}>{label}</span>
      </div>
    </NavContext.Provider>
  );
}
