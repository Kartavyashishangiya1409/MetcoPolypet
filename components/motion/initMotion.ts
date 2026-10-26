'use client';

import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

const ease = 'expo.out';

/**
 * Port of the design's `init()`: wires every data-* motion hook inside `root`.
 * Returns a gsap.Context — call `.revert()` before the next page initialises.
 *
 * `firstLoad`: on a hard load, elements already in view were painted by the server before JS
 * ran, so they're left as-is (on-load reveals for them run as CSS keyframes). After a client
 * navigation the transition panel covers the swap, so everything animates as in the design.
 */
export function initMotion(root: HTMLElement, firstLoad: boolean): gsap.Context | null {
  if (prefersReducedMotion()) return null;
  const vh = window.innerHeight;
  const inView = (el: Element, ratio = 1) => el.getBoundingClientRect().top < vh * ratio;

  const ctx = gsap.context(() => {
    // Headline line reveal (scroll-triggered; [data-now] headings are handled in CSS)
    root.querySelectorAll<HTMLElement>('[data-split]:not([data-now])').forEach((grp) => {
      if (firstLoad && inView(grp, 0.88)) return;
      const lines = grp.querySelectorAll('[data-line]');
      gsap.from(lines, {
        yPercent: 115,
        duration: 1.3,
        ease,
        stagger: 0.09,
        scrollTrigger: { trigger: grp, start: 'top 88%' },
      });
    });

    // Fade-up
    root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
      const now = inView(el);
      if (firstLoad && now) return;
      gsap.from(el, {
        y: 32,
        opacity: 0,
        duration: 1.2,
        ease,
        delay: now ? 0.55 : 0,
        scrollTrigger: now ? undefined : { trigger: el, start: 'top 92%' },
      });
    });

    // Hero preform: parallax, scale and rotate as the hero scrolls out
    root.querySelectorAll<HTMLElement>('[data-hero-obj]').forEach((el) => {
      gsap.to(el, {
        yPercent: 18,
        scale: 0.86,
        rotation: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Clip wipe
    root.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
      if (firstLoad && inView(el, 0.88)) return;
      const st = { trigger: el, start: 'top 88%' };
      gsap.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease, scrollTrigger: st });
      if (el.firstElementChild)
        gsap.from(el.firstElementChild, { scale: 1.2, duration: 2, ease, scrollTrigger: st });
    });

    // Parallax
    root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) =>
      gsap.fromTo(
        el,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      ),
    );

    // Story: sticky stage, four text/image pairs cross-fade on a scrubbed timeline
    root.querySelectorAll<HTMLElement>('[data-story]').forEach((sec) => {
      const t = [...sec.querySelectorAll('[data-story-item]')];
      const im = [...sec.querySelectorAll('[data-story-img]')];
      const bar = sec.querySelector('[data-story-bar]');
      gsap.set(t.slice(1), { opacity: 0, y: 60 });
      gsap.set(im.slice(1), { opacity: 0, scale: 1.08 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      });
      for (let i = 1; i < t.length; i++) {
        tl.to(t[i - 1], { opacity: 0, y: -60, duration: 0.5, ease: 'power2.in' }, i)
          .to(im[i - 1], { opacity: 0, duration: 0.6 }, i)
          .to(t[i], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i + 0.35)
          .to(im[i], { opacity: 1, scale: 1, duration: 0.7 }, i + 0.2);
      }
      tl.to({}, { duration: 0.8 });
      if (bar)
        gsap.fromTo(
          bar,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true },
          },
        );
    });

    // Range rail: horizontal track driven by vertical scroll
    root.querySelectorAll<HTMLElement>('[data-rail]').forEach((sec) => {
      const tr = sec.querySelector<HTMLElement>('[data-rail-track]');
      if (!tr) return;
      gsap.to(tr, {
        x: () => -Math.max(0, tr.scrollWidth - sec.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
  }, root);

  ScrollTrigger.refresh();
  return ctx;
}
