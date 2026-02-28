export default function TimelineView({ context }) {
  return (
    <section className="card">
      <h3>Memory Timeline</h3>
      {!context?.length && <p>No timeline data yet.</p>}
      {(context || []).map((c, i) => (
        <div className="timeline-row" key={c.id}>
          <span className="timeline-dot" />
          <div className="timeline-content">
            <strong>{c.id}</strong>
            <p className="small">Rank #{i + 1}</p>
          </div>
          <span className="badge">score {c.score}</span>
        </div>
      ))}
    </section>
  );
}
