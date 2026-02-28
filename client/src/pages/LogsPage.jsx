import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function LogsPage() {
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    api("/decision-log").then((d) => setDecisions(d.decisions || []));
  }, []);

  return (
    <div>
      <header className="page-header">
        <h2>Decision Logs</h2>
        <p className="muted">Audit trail for decision outcomes and inputs.</p>
      </header>

      <section className="card">
        {!decisions.length ? <p className="muted">No decisions logged yet.</p> : null}
        {decisions.map((d, idx) => (
          <div className="list-row" key={`${d.at}-${idx}`}>
            <strong>{d.output?.kind || "-"}</strong>
            <span>{new Date(d.at).toLocaleString()}</span>
            <span>{d.output?.decision || d.output?.escalation || "-"}</span>
            <span>score {d.output?.score ?? "-"}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
