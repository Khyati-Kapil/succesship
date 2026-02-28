export default function DecisionPanel({ result, embedded = false }) {
  const Tag = embedded ? "div" : "section";
  const className = embedded ? "" : "card";

  if (!result) {
    return (
      <Tag className={className}>
        <h3>Decision</h3>
        <p>No decision yet.</p>
      </Tag>
    );
  }

  const title = result.kind === "support" ? "Support Escalation Result" : "Invoice Decision Result";
  const primaryLabel = result.kind === "support" ? "Priority" : "Decision";
  const primaryValue = result.kind === "support" ? result.priority || "-" : result.decision || "-";
  const secondaryLabel = result.kind === "support" ? "Escalation" : "Risk Score";
  const secondaryValue =
    result.kind === "support" ? result.escalation || "-" : result.score ?? "-";
  const urgency =
    (result.score ?? 0) >= 0.65 ? "High" : (result.score ?? 0) >= 0.4 ? "Medium" : "Low";
  const recommendedAction =
    result.kind === "support"
      ? result.escalation || "standard_queue"
      : result.decision || "manual_review";
  const invoiceTone =
    result.kind !== "invoice"
      ? ""
      : result.decision === "escalate_procurement"
        ? "critical"
        : result.decision === "manual_review"
          ? "warning"
          : "safe";
  const actionPlan =
    result.kind === "support"
      ? urgency === "High"
        ? [
            "Start incident bridge and assign incident manager.",
            "Notify account manager and engineering lead immediately.",
            "Send customer update within 30 minutes and track SLA."
          ]
        : urgency === "Medium"
          ? [
              "Route to rapid response queue with clear owner.",
              "Validate logs against top context patterns.",
              "Share resolution ETA and checkpoint with customer."
            ]
          : [
              "Process in standard queue with clear ownership.",
              "Use top context to avoid repeat troubleshooting.",
              "Close with prevention note."
            ]
      : urgency === "High"
        ? [
            "Hold payment and escalate to procurement and quality.",
            "Require fresh inspection evidence for this batch.",
            "Approve only after risk owner sign-off."
          ]
        : urgency === "Medium"
          ? [
              "Move invoice to manual review queue.",
              "Check supplier recurrence in last 120 days.",
              "Finalize after reviewer notes are recorded."
            ]
          : [
              "Proceed with standard approval flow.",
              "Record context snapshot for audit.",
              "Continue periodic supplier monitoring."
            ];

  return (
    <Tag className={className}>
      <h3>{title}</h3>

      {result.kind === "invoice" ? (
        <div className={`invoice-highlight invoice-${invoiceTone}`}>
          <p className="invoice-kicker">Final Invoice Decision</p>
          <div className="invoice-main-row">
            <strong className="invoice-main-value">{result.decision}</strong>
            <span className={`decision-chip chip-${invoiceTone}`}>{urgency} Attention</span>
          </div>
          <p className="invoice-note">
            Evaluator focus: apply this action first, then validate with top context signals.
          </p>
        </div>
      ) : null}

      <div className="summary-grid">
        <div className="summary-box">
          <span className="summary-label">{primaryLabel}</span>
          <strong>{primaryValue}</strong>
        </div>
        <div className="summary-box">
          <span className="summary-label">{secondaryLabel}</span>
          <strong>{secondaryValue}</strong>
        </div>
        <div className="summary-box">
          <span className="summary-label">Score</span>
          <strong>{result.score ?? "-"}</strong>
        </div>
        <div className="summary-box">
          <span className="summary-label">Urgency</span>
          <strong className={`urgency urgency-${urgency.toLowerCase()}`}>{urgency}</strong>
        </div>
      </div>

      <div className="recommendation">
        <span className="summary-label">Recommended Action</span>
        <strong>{recommendedAction}</strong>
      </div>

      <h4>Recommended Steps</h4>
      <ul>
        {actionPlan.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      {result.reasons?.length ? (
        <>
          <h4>Reasons</h4>
          <ul>
            {result.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      ) : null}

      {result.signals?.length ? (
        <>
          <h4>Signals</h4>
          <ul>
            {result.signals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      ) : null}

      {result.stakeholders?.length ? (
        <>
          <h4>Stakeholders</h4>
          <p>{result.stakeholders.join(", ")}</p>
        </>
      ) : null}
    </Tag>
  );
}
