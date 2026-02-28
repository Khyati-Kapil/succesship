import { useEffect, useMemo, useState } from "react";
import EntitySelector from "../components/EntitySelector.jsx";
import { api } from "../api.js";

export default function MemoryPage() {
  const [entities, setEntities] = useState([]);
  const [kind, setKind] = useState("supplier");
  const [entityId, setEntityId] = useState("");
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    api("/entities").then((d) => setEntities(d.entities || []));
  }, []);

  const filtered = useMemo(() => entities.filter((e) => e.kind === kind), [entities, kind]);

  useEffect(() => {
    setEntityId("");
    setMemories([]);
  }, [kind]);

  async function loadMemories() {
    if (!entityId) return;
    const data = await api(`/memories/${entityId}`);
    setMemories(data.memories || []);
  }

  return (
    <div>
      <header className="page-header">
        <h2>Memory Explorer</h2>
        <p className="muted">Inspect stored memories and business context by entity.</p>
      </header>

      <section className="card form-grid">
        <label className="field">
          <span>Entity Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
        </label>
        <EntitySelector entities={filtered} value={entityId} onChange={setEntityId} label="Entity" />
        <button className="btn" onClick={loadMemories} disabled={!entityId}>Load Memories</button>
      </section>

      <section className="card">
        <h3>Memories</h3>
        {!memories.length ? <p className="muted">No memories loaded.</p> : null}
        {memories.map((m) => (
          <div className="item" key={m.id}>
            <div className="item-head">
              <strong>{m.title}</strong>
              <span className="badge">{m.type}</span>
            </div>
            <p>Impact: {m.impact} | Reliability: {m.reliability}</p>
            <p>Tags: {(m.tags || []).join(", ")}</p>
            <p className="small">{new Date(m.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
