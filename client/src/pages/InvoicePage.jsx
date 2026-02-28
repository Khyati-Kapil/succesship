import { useEffect, useMemo, useState } from "react";
import EntitySelector from "../components/EntitySelector.jsx";
import DecisionPanel from "../components/DecisionPanel.jsx";
import ContextPanel from "../components/ContextPanel.jsx";
import { api } from "../api.js";

export default function InvoicePage() {
  const [entities, setEntities] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState(250000);
  const [tags, setTags] = useState("quality_issue,logistics_delay");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const suppliers = useMemo(() => entities.filter((e) => e.kind === "supplier"), [entities]);

  useEffect(() => {
    api("/entities")
      .then((d) => setEntities(d.entities || []))
      .catch(() => setError("Failed to load suppliers."));
  }, []);

  async function run() {
    try {
      const payload = {
        supplierId,
        amount: Number(amount),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        invoiceDate: new Date().toISOString()
      };
      setResult(await api("/decide/invoice", { method: "POST", body: JSON.stringify(payload) }));
      setError("");
    } catch {
      setError("Invoice decision failed. Seed data first.");
    }
  }

  return (
    <div>
      <header className="page-header">
        <h2>Invoice Decision</h2>
        <p className="muted">Evaluate supplier invoice risk using contextual memory signals.</p>
      </header>
      {error ? <p className="error-banner">{error}</p> : null}

      <section className="card form-grid">
        <EntitySelector entities={suppliers} value={supplierId} onChange={setSupplierId} label="Supplier" />
        <label className="field"><span>Invoice Amount</span><input value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label className="field full"><span>Risk Tags</span><input value={tags} onChange={(e) => setTags(e.target.value)} /></label>
        <button className="btn" onClick={run} disabled={!supplierId}>Evaluate Invoice</button>
      </section>

      <section className="grid">
        <DecisionPanel result={result} />
        <ContextPanel context={result?.context || []} />
      </section>
    </div>
  );
}
