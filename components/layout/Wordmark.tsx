'use client';

import { useEffect, useId, useRef } from 'react';
import s from './Footer.module.scss';

/** Spotlight radius, in viewBox units (the word is ~994 wide) */
const SPOT_R = 150;

/**
 * Footer wordmark. At rest it is a faint charcoal gradient barely lifted off the footer; a soft
 * silver spotlight follows the cursor and lights the letters under it. The spotlight is a
 * radial gradient on a second copy of the text, eased toward the pointer each frame.
 *
 * The viewBox is cropped to the glyphs' ink (12 → 1006): the M's side bearing and the negative
 * tracking after the last t otherwise push the word ~9 units right of centre.
 */
export function Wordmark({ text }: { text: string }) {
  const id = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const spotRef = useRef<SVGRadialGradientElement>(null);
  const litRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const spot = spotRef.current;
    const lit = litRef.current;
    if (!svg || !spot || !lit || !matchMedia('(hover: hover)').matches) return;

    const target = { x: 500, y: 75 };
    const pos = { ...target };
    let frame = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      spot.setAttribute('cx', pos.x.toFixed(1));
      spot.setAttribute('cy', pos.y.toFixed(1));
      frame =
        Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.2
          ? requestAnimationFrame(tick)
          : 0;
    };
    const toSvg = (e: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    };
    const onMove = (e: PointerEvent) => {
      const p = toSvg(e);
      if (!p) return;
      target.x = p.x;
      target.y = p.y;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onEnter = (e: PointerEvent) => {
      // Start the spotlight where the cursor enters instead of sliding in from the last spot.
      const p = toSvg(e);
      if (p) {
        target.x = pos.x = p.x;
        target.y = pos.y = p.y;
        spot.setAttribute('cx', String(p.x));
        spot.setAttribute('cy', String(p.y));
      }
      lit.style.opacity = '1';
    };
    const onLeave = () => {
      lit.style.opacity = '0';
    };

    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerenter', onEnter);
    svg.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerenter', onEnter);
      svg.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const glyphs = {
    x: 500,
    y: 118,
    textAnchor: 'middle',
    textLength: 1000,
    lengthAdjust: 'spacingAndGlyphs',
  } as const;

  return (
    <svg ref={svgRef} viewBox="12 0 994 150" aria-hidden="true" className={s.wordmark}>
      <defs>
        {/* Resting fill: charcoal at the cap line fading toward the footer black at the base */}
        <linearGradient
          id={`${id}-base`}
          x1="0"
          y1="0"
          x2="0"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.25" stopColor="#262727" />
          <stop offset="1" stopColor="#141515" />
        </linearGradient>
        {/* Spotlight: silver core, soft falloff to nothing */}
        <radialGradient
          ref={spotRef}
          id={`${id}-spot`}
          cx="500"
          cy="75"
          r={SPOT_R}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#a4a6a2" />
          <stop offset="0.4" stopColor="#7c7e7a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#262727" stopOpacity="0" />
        </radialGradient>
      </defs>
      <text {...glyphs} fill={`url(#${id}-base)`}>
        {text}
      </text>
      <text ref={litRef} {...glyphs} fill={`url(#${id}-spot)`} className={s.lit}>
        {text}
      </text>
    </svg>
  );
}
