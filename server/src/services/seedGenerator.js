import { EntityKinds } from "../models/Entity.js";

function rand(seed) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)];
}

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function generateBusinessData() {
  const r = rand(42);
  const entities = [];
  const memories = [];
  const links = [];
  const invoices = [];
  const tickets = [];

  for (let i = 1; i <= 50; i += 1) {
    const kind = i <= 25 ? EntityKinds.SUPPLIER : EntityKinds.CUSTOMER;
    entities.push({ id: `${kind}_${i}`, kind, name: `${kind.toUpperCase()} ${i}` });
  }

  let memId = 1;
  for (const e of entities) {
    const isSupplier = e.kind === EntityKinds.SUPPLIER;
    const baseTags = isSupplier
      ? ["quality_issue", "logistics_delay", "payment_dispute", "seasonal_risk", "delivery_ok"]
      : ["sla_risk", "renewal_risk", "api_dependency", "cto_involved", "resolved_fast"];

    for (let j = 0; j < 12; j += 1) {
      const primary = pick(r, baseTags);
      memories.push({
        id: `MEM-${memId}`,
        entityId: e.id,
        type: pick(r, ["historical", "temporal", "experiential", "policy"]),
        createdAt: isoDaysAgo(Math.floor(r() * 700) + 5),
        title: `${e.name} - ${primary.replace(/_/g, " ")}`,
        tags: [primary],
        impact: Number((0.2 + r() * 0.75).toFixed(2)),
        reliability: Number((0.5 + r() * 0.5).toFixed(2))
      });
      memId += 1;
    }
  }

  for (let i = 0; i < memories.length / 2; i += 1) {
    const a = memories[Math.floor(r() * memories.length)];
    const b = memories[Math.floor(r() * memories.length)];
    if (!a || !b || a.id === b.id) continue;
    links.push({
      id: `LNK-${i + 1}`,
      fromMemoryId: a.id,
      toMemoryId: b.id,
      relationType: pick(r, ["causal", "correlated", "escalation_context"]),
      weight: Number((0.4 + r() * 0.5).toFixed(2))
    });
  }

  for (let i = 1; i <= 500; i += 1) {
    const supplier = entities[Math.floor(r() * 25)];
    invoices.push({
      id: `INV-${i}`,
      supplierId: supplier.id,
      amount: Math.floor(50000 + r() * 400000),
      tags: [pick(r, ["quality_issue", "seasonal_risk", "logistics_delay", "payment_dispute"])],
      invoiceDate: isoDaysAgo(Math.floor(r() * 90) + 1)
    });
  }

  for (let i = 1; i <= 200; i += 1) {
    const customer = entities[25 + Math.floor(r() * 25)];
    tickets.push({
      id: `TCK-${i}`,
      customerId: customer.id,
      tags: [pick(r, ["sla_risk", "renewal_risk", "api_dependency", "cto_involved"])],
      ticketTime: isoDaysAgo(Math.floor(r() * 90) + 1)
    });
  }

  return { entities, memories, links, invoices, tickets, decisions: [] };
}
