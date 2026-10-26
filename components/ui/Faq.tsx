import s from './Faq.module.scss';

/**
 * FAQ accordion on native <details>/<summary>: keyboard accessible, and every answer stays in the
 * server-rendered DOM while collapsed. `name` makes it exclusive (one open at a time), like the
 * design; the first item starts open.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={s.list}>
      {items.map((f, i) => (
        <details key={f.q} name="faq" open={i === 0} className={s.item}>
          <summary className={s.summary}>
            <h3 className={s.q}>{f.q}</h3>
            <span aria-hidden="true" className={s.icon}>
              +
            </span>
          </summary>
          <p className={s.a}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
