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

  useEffect(() => {
    const start = () => setMount(true);
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(cb, { timeout: 2500 })
        : setTimeout(cb, 1200);
    const go = () => idle(start);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);

  return (
    <div className={`${s.stage} ${ready ? s.ready : ''}`} role="img" aria-label={label}>
      {children}
      {mount && (
        <HeroPreform src="/models/metco-pet-preform.glb" bg="#F4F4F1" onLoad={() => setReady(true)} />
      )}
    </div>
  );
}
