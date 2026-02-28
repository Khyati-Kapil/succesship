import { useEffect, useMemo, useState } from "react";
import EntitySelector from "../components/EntitySelector.jsx";
import DecisionPanel from "../components/DecisionPanel.jsx";
import ContextPanel from "../components/ContextPanel.jsx";
import { api } from "../api.js";

export default function SupportPage() {
  const [entities, setEntities] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [tags, setTags] = useState("sla_risk,api_dependency");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const customers = useMemo(() => entities.filter((e) => e.kind === "customer"), [entities]);

  useEffect(() => {
    api("/entities")
      .then((d) => setEntities(d.entities || []))
      .catch(() => setError("Failed to load customers."));
  }, []);

  async function run() {
    try {
      const payload = {
        customerId,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        ticketTime: new Date().toISOString()
      };
      setResult(await api("/decide/support", { method: "POST", body: JSON.stringify(payload) }));
      setError("");
    } catch {
      setError("Support decision failed. Seed data first.");
    }
  }

  return (
    <div>
      <header className="page-header">
        <h2>Support Escalation</h2>
        <p className="muted">Assess ticket urgency and escalation path from historical context.</p>
      </header>
      {error ? <p className="error-banner">{error}</p> : null}

      <section className="card form-grid">
        <EntitySelector entities={customers} value={customerId} onChange={setCustomerId} label="Customer" />
        <label className="field full"><span>Risk Tags</span><input value={tags} onChange={(e) => setTags(e.target.value)} /></label>
        <button className="btn" onClick={run} disabled={!customerId}>Evaluate Support Ticket</button>
      </section>

      <section className="grid">
        <DecisionPanel result={result} />
        <ContextPanel context={result?.context || []} />
      </section>
    </div>
  );
}
