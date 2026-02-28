export default function ContextPanel({ context, embedded = false }) {
  const Tag = embedded ? "div" : "section";
  const className = embedded ? "" : "card";
  return (
    <Tag className={className}>
      <h3>Retrieved Context Ranking</h3>
      {!context?.length && <p>No context yet.</p>}
      {context?.map((c) => (
        <div key={c.id} className="item">
          <div className="item-head">
            <strong>{c.title}</strong>
            <span className="badge">score {c.score}</span>
          </div>
          <div className="meter">
            <div className="meter-fill" style={{ width: `${Math.max(3, (c.score || 0) * 100)}%` }} />
          </div>
          <p>Tags: {(c.tags || []).join(", ") || "-"}</p>
          <p className="small">{c.why}</p>
        </div>
      ))}
    </Tag>
  );
}
