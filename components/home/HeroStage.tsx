'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type ReactNode } from 'react';
import s from './Hero.module.scss';

// Three.js lives in its own chunk and is never server-rendered.
const HeroPreform = dynamic(() => import('./HeroPreform'), { ssr: false });

/**
 * Holds the server-rendered poster (LCP image) and mounts the 3D viewer after first paint,
 * cross-fading poster → canvas once the model is ready.
 */
export function HeroStage({ children, label }: { children: ReactNode; label: string }) {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  // The poster already shows the preform, so the WebGL viewer (the heaviest work on the site)
  // starts on the first interaction, or a few seconds after load when the main thread is idle.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const events = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      clearTimeout(timer);
      setMount(true);
    };
    const idle = () =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(start, { timeout: 2000 })
        : start();
    const afterLoad = () => {
      timer = setTimeout(idle, 3500);
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', afterLoad);
    };
  }, []);

  return (
    <div className={`${s.stage} ${ready ? s.ready : ''}`} role="img" aria-label={label}>
      {children}
      {mount && (
        <HeroPreform
          src="/models/metco-pet-preform.glb"
          bg="#F4F4F1"
          onLoad={() => setReady(true)}
        />
      )}
    </div>
  );
}
