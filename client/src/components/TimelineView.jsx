export default function TimelineView({ context }) {
  return (
    <section className="card">
      <h3>Memory Timeline</h3>
      <ul>
        {(context || []).map((c) => (
          <li key={c.id}>{c.id}: score {c.score}</li>
        ))}
      </ul>
    </section>
  );
}
