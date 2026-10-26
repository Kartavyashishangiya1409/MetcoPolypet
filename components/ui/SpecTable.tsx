import s from './SpecTable.module.scss';

/** Plain HTML spec table (mono), row headers scoped for screen readers. */
export function SpecTable({
  rows,
  caption,
}: {
  rows: { k: string; v: string }[];
  caption?: string;
}) {
  return (
    <table className={s.table}>
      {caption && <caption className="visually-hidden">{caption}</caption>}
      <tbody>
        {rows.map((r) => (
          <tr key={r.k}>
            <th scope="row">{r.k}</th>
            <td>{r.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
