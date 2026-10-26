'use client';

import {
  Suspense,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { submitEnquiry } from '@/app/contact/actions';
import {
  readEnquiry,
  validateEnquiry,
  productOptions,
  type EnquiryErrors,
  type EnquiryState,
} from '@/lib/enquiry-schema';
import { formFields } from '@/content/contact';
import { getProduct } from '@/content/products';
import s from './Contact.module.scss';

const initial: EnquiryState = { status: 'idle' };

/** Enquiry form. `?product=<slug>` (from a product's "Request quote") pre-selects the preform. */
export function EnquiryForm() {
  // Remounting resets the action state ("Send another enquiry").
  const [round, setRound] = useState(0);
  return <Form key={round} onReset={() => setRound(round + 1)} />;
}

/**
 * Applies ?product=<slug> to the select after hydration. Kept in its own Suspense boundary so the
 * form itself always renders in the same position (static HTML, and no-JS server action replies).
 */
function Prefill({ target }: { target: RefObject<HTMLSelectElement | null> }) {
  const slug = useSearchParams().get('product');
  const name = (slug && getProduct(slug)?.name) || '';
  useEffect(() => {
    if (name && target.current && !target.current.value) target.current.value = name;
  }, [name, target]);
  return null;
}

function Form({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [clientErrors, setClientErrors] = useState<EnquiryErrors | null>(null);
  const errors = clientErrors ?? state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === 'sent') {
    return (
      <div className={s.sent} role="status">
        <span className={s.sentLabel}>Enquiry received</span>
        <div className={s.sentBody}>
          <p className={s.sentTitle}>Thank you. We&apos;ll reply within one working day.</p>
          <p className={s.sentNote}>A copy has been sent to your email.</p>
        </div>
        <button type="button" className={s.again} onClick={onReset}>
          Send another enquiry
        </button>
      </div>
    );
  }

  // Instant client-side check with the same schema; the server re-validates.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const { errors: found } = validateEnquiry(readEnquiry(new FormData(e.currentTarget)));
    if (found) {
      e.preventDefault();
      setClientErrors(found);
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else setClientErrors(null);
  };

  return (
    <form action={action} onSubmit={onSubmit} noValidate className={s.form} aria-busy={pending}>
      {formFields.map((f) => (
        <label key={f.name} className={s.field}>
          <span className={s.label}>{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            autoComplete={f.ac}
            placeholder={f.ph}
            defaultValue={v[f.name]}
            required
            aria-invalid={!!errors[f.name]}
            aria-describedby={`err-${f.name}`}
            className={`${s.input} ${errors[f.name] ? s.invalid : ''}`}
          />
          <span id={`err-${f.name}`} className={s.err} aria-live="polite">
            {errors[f.name] ?? ''}
          </span>
        </label>
      ))}

      <label className={s.field}>
        <span className={s.label}>Preform / neck finish</span>
        <Suspense fallback={null}>
          <Prefill target={selectRef} />
        </Suspense>
        <select
          ref={selectRef}
          name="product"
          defaultValue={v.product ?? ''}
          aria-invalid={!!errors.product}
          className={s.input}
        >
          <option value="">Select</option>
          {productOptions
            .filter((o) => o !== 'Custom')
            .map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          <option value="Custom">Custom design</option>
        </select>
      </label>

      <label className={s.field}>
        <span className={s.label}>Monthly quantity</span>
        <input name="qty" placeholder="e.g. 5,00,000 pcs" defaultValue={v.qty} className={s.input} />
      </label>

      <label className={`${s.field} ${s.full}`}>
        <span className={s.label}>Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Bottle volume, colour, delivery location, timelines"
          defaultValue={v.message}
          className={s.textarea}
        />
      </label>

      {/* Honeypot — hidden from people and assistive tech, tempting to bots */}
      <div className={s.hp} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className={`${s.full} ${s.submitRow}`}>
        {errors.form ? (
          <span className={s.formErr} role="alert">
            {errors.form}
          </span>
        ) : (
          <span className={s.hint}>Attach drawings by replying to our confirmation email.</span>
        )}
        <button type="submit" className={s.submit} disabled={pending}>
          {pending ? 'Sending…' : 'Send enquiry →'}
        </button>
      </div>
    </form>
  );
}
