import { useEffect, useMemo, useState } from "react";
import EntitySelector from "./components/EntitySelector.jsx";
import ContextPanel from "./components/ContextPanel.jsx";
import MemoryGraph from "./components/MemoryGraph.jsx";
import DecisionPanel from "./components/DecisionPanel.jsx";
import TimelineView from "./components/TimelineView.jsx";

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function App() {
  const [entities, setEntities] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState(250000);
  const [tags, setTags] = useState("quality_issue,logistics_delay");
  const [ticketTags, setTicketTags] = useState("sla_risk,api_dependency");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const suppliers = useMemo(() => entities.filter((e) => e.kind === "supplier"), [entities]);
  const customers = useMemo(() => entities.filter((e) => e.kind === "customer"), [entities]);

  async function refreshEntities() {
    const data = await api("/entities");
    setEntities(data.entities || []);
  }

  useEffect(() => {
    refreshEntities().catch(() => {});
  }, []);

  async function seed() {
    setLoading(true);
    try {
      await api("/seed", { method: "POST" });
      await refreshEntities();
      setResult({ message: "Simulation seeded: 50 suppliers/customers, 500 invoices, 200 tickets" });
    } finally {
      setLoading(false);
    }
  }

  async function runInvoice() {
    setLoading(true);
    try {
      const payload = {
        supplierId,
        amount: Number(amount),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        invoiceDate: new Date().toISOString()
      };
      setResult(await api("/decide/invoice", { method: "POST", body: JSON.stringify(payload) }));
    } finally {
      setLoading(false);
    }
  }

  async function runSupport() {
    setLoading(true);
    try {
      const payload = {
        customerId,
        tags: ticketTags.split(",").map((t) => t.trim()).filter(Boolean),
        ticketTime: new Date().toISOString()
      };
      setResult(await api("/decide/support", { method: "POST", body: JSON.stringify(payload) }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="layout">
      <h1>Context-Aware AI Decision Engine (Full-Stack Demo)</h1>
      <p>Seed business simulation, trigger invoice/support decisions, and inspect explainable context retrieval.</p>

      <section className="card row">
        <button onClick={seed} disabled={loading}>Seed Simulation</button>
        <EntitySelector entities={suppliers} value={supplierId} onChange={setSupplierId} label="Supplier" />
        <label className="field"><span>Invoice Amount</span><input value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label className="field"><span>Invoice Tags</span><input value={tags} onChange={(e) => setTags(e.target.value)} /></label>
        <button onClick={runInvoice} disabled={!supplierId || loading}>Run Invoice Decision</button>
      </section>

      <section className="card row">
        <EntitySelector entities={customers} value={customerId} onChange={setCustomerId} label="Customer" />
        <label className="field"><span>Ticket Tags</span><input value={ticketTags} onChange={(e) => setTicketTags(e.target.value)} /></label>
        <button onClick={runSupport} disabled={!customerId || loading}>Run Support Decision</button>
      </section>

      <div className="grid">
        <DecisionPanel result={result} />
        <ContextPanel context={result?.context || []} />
        <MemoryGraph context={result?.context || []} />
        <TimelineView context={result?.context || []} />
      </div>
    </main>
  );
}
