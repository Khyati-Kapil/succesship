import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  async function loadSummary() {
    try {
      const data = await api("/dashboard-summary");
      setSummary(data);
      setError("");
    } catch {
      setError("Backend not reachable. Start server on port 4000.");
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function seed() {
    setSeeding(true);
    try {
      await api("/seed", { method: "POST" });
      await loadSummary();
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p className="muted">Business context health and decision activity overview.</p>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="card toolbar-inline">
        <button className="btn btn-warm" onClick={seed} disabled={seeding}>
          {seeding ? "Seeding..." : "Seed Simulation Data"}
        </button>
        <Link className="btn-link" to="/invoice">Run Invoice Flow</Link>
        <Link className="btn-link" to="/support">Run Support Flow</Link>
      </section>

      <section className="metric-grid">
        <Metric title="Suppliers" value={summary?.suppliers ?? "-"} />
        <Metric title="Customers" value={summary?.customers ?? "-"} />
        <Metric title="Memories" value={summary?.memories ?? "-"} />
        <Metric title="Links" value={summary?.links ?? "-"} />
        <Metric title="Invoices" value={summary?.invoices ?? "-"} />
        <Metric title="Support Tickets" value={summary?.tickets ?? "-"} />
        <Metric title="High-Risk Invoices" value={summary?.highRiskInvoices ?? "-"} />
        <Metric title="P1 Support Cases" value={summary?.highPrioritySupport ?? "-"} />
      </section>

      <section className="card">
        <h3>Recent Decisions</h3>
        {!summary?.recentDecisions?.length ? <p className="muted">No decisions yet.</p> : null}
        {(summary?.recentDecisions || []).map((d, idx) => (
          <div className="list-row" key={`${d.at}-${idx}`}>
            <strong>{d.output?.kind === "invoice" ? "Invoice" : "Support"}</strong>
            <span>{new Date(d.at).toLocaleString()}</span>
            <span>
              {d.output?.decision || d.output?.escalation || "-"}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="card metric-card">
      <p className="metric-label">{title}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
}
