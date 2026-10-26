'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { lockScroll } from '@/lib/lenis';
import s from './ProductModal.module.scss';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Product detail dialog over the catalogue (intercepted /products/[slug] route).
 * Esc, backdrop click and the × button go back; focus is trapped and restored.
 */
export function ProductModal({ labelId, children }: { labelId: string; children: ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    const outside = [
      document.querySelector('header'),
      document.querySelector('main [data-page]'),
      document.getElementById('site-footer'),
    ];
    outside.forEach((el) => el?.setAttribute('inert', ''));
    lockScroll(true);
    dialog.querySelector<HTMLElement>('[data-close]')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      outside.forEach((el) => el?.removeAttribute('inert'));
      lockScroll(false);
      opener?.focus?.({ preventScroll: true });
    };
  }, [close]);

  return (
    <div className={s.backdrop} onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className={s.dialog}
        data-lenis-prevent=""
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/** × button rendered inside the panel header; closes the modal. */
export function CloseButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      data-close=""
      aria-label="Close"
      className={s.close}
      onClick={() => router.back()}
    >
      ×
    </button>
  );
}
