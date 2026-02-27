export default function MemoryGraph({ context }) {
  return (
    <section className="card">
      <h3>Entity Graph (simplified)</h3>
      <ul>
        {(context || []).slice(0, 8).map((c, i) => (
          <li key={c.id}>{i + 1}. {c.id} -> {c.tags?.[0] || "signal"}</li>
        ))}
      </ul>
    </section>
  );
}
