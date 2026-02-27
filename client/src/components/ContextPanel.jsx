export default function ContextPanel({ context }) {
  return (
    <section className="card">
      <h3>Retrieved Context Ranking</h3>
      {!context?.length && <p>No context yet.</p>}
      {context?.map((c) => (
        <div key={c.id} className="item">
          <strong>{c.title}</strong>
          <p>Score: {c.score}</p>
          <p>Tags: {(c.tags || []).join(", ")}</p>
          <p className="small">{c.why}</p>
        </div>
      ))}
    </section>
  );
}
