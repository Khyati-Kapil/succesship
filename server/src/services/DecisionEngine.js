import { retrieveContext } from "./ContextRetriever.js";
import { MemoryStore } from "./MemoryStore.js";

export function decideInvoice(payload) {
  const ranked = retrieveContext({
    entityId: payload.supplierId,
    tags: payload.tags || [],
    requiredTags: ["quality_issue", "payment_dispute", "logistics_delay"],
    now: payload.invoiceDate
  });

  let risk = 0;
  const reasons = [];
  for (const row of ranked) {
    const tags = new Set(row.memory.tags || []);
    if (tags.has("quality_issue")) { risk += 0.25 * row.score; reasons.push("quality issue history"); }
    if (tags.has("payment_dispute")) { risk += 0.2 * row.score; reasons.push("payment dispute history"); }
    if (tags.has("logistics_delay")) { risk += 0.15 * row.score; reasons.push("logistics delay pattern"); }
    if (tags.has("seasonal_risk")) { risk += 0.1 * row.score; reasons.push("seasonal risk signal"); }
  }
  if ((payload.amount || 0) >= 250000) {
    risk += 0.1;
    reasons.push("high amount threshold crossed");
  }
  risk = Math.max(0, Math.min(1, risk));

  const decision = risk >= 0.6 ? "escalate_procurement" : risk >= 0.35 ? "manual_review" : "auto_approve";
  const result = {
    kind: "invoice",
    decision,
    score: Number(risk.toFixed(3)),
    reasons: [...new Set(reasons)].slice(0, 5),
    context: ranked.map((r) => ({ id: r.memory.id, title: r.memory.title, tags: r.memory.tags, score: Number(r.score.toFixed(3)), why: r.why }))
  };
  MemoryStore.logDecision({ at: new Date().toISOString(), input: payload, output: result });
  return result;
}

export function decideSupport(payload) {
  const ranked = retrieveContext({
    entityId: payload.customerId,
    tags: payload.tags || [],
    requiredTags: ["sla_risk", "renewal_risk", "api_dependency", "cto_involved"],
    now: payload.ticketTime
  });

  let severity = 0;
  const signals = [];
  const stakeholders = new Set(["support_engineer"]);
  let communicationStyle = "summary_report";

  for (const row of ranked) {
    const tags = new Set(row.memory.tags || []);
    if (tags.has("sla_risk")) { severity += 0.3 * row.score; signals.push("SLA risk detected"); }
    if (tags.has("renewal_risk")) { severity += 0.25 * row.score; signals.push("renewal risk detected"); stakeholders.add("account_manager"); }
    if (tags.has("api_dependency")) { severity += 0.2 * row.score; signals.push("API dependency high"); }
    if (tags.has("cto_involved")) { severity += 0.15 * row.score; signals.push("executive stakeholder involved"); stakeholders.add("engineering_lead"); communicationStyle = "technical_deep_dive"; }
  }

  severity = Math.max(0, Math.min(1, severity));
  let priority = "p3";
  let escalation = "standard_queue";
  if (severity >= 0.65) {
    priority = "p1";
    escalation = "immediate_war_room";
    stakeholders.add("incident_manager");
  } else if (severity >= 0.4) {
    priority = "p2";
    escalation = "rapid_response";
  }

  const result = {
    kind: "support",
    priority,
    escalation,
    score: Number(severity.toFixed(3)),
    communicationStyle,
    stakeholders: [...stakeholders].sort(),
    signals: [...new Set(signals)].slice(0, 5),
    context: ranked.map((r) => ({ id: r.memory.id, title: r.memory.title, tags: r.memory.tags, score: Number(r.score.toFixed(3)), why: r.why }))
  };
  MemoryStore.logDecision({ at: new Date().toISOString(), input: payload, output: result });
  return result;
}
