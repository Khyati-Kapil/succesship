export default function MemoryGraph({ context }) {
  return (
    <section className="card">
      <h3>Entity Graph (simplified)</h3>
      {!context?.length && <p>No graph nodes yet.</p>}
      <div className="graph-list">
        {(context || []).slice(0, 8).map((c, i) => (
          <div key={c.id} className="graph-node">
            <span className="node-index">{i + 1}</span>
            <div>
              <strong>{c.id}</strong>
              <p className="small">{c.tags?.[0] || "signal"} relation</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
