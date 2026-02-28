import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data/db.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ entities: [], memories: [], links: [], invoices: [], tickets: [], decisions: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const MemoryStore = {
  reset(payload) {
    writeDb(payload);
  },
  getAll() {
    return readDb();
  },
  getEntities(kind) {
    const db = readDb();
    return kind ? db.entities.filter((e) => e.kind === kind) : db.entities;
  },
  getMemoriesByEntity(entityId) {
    const db = readDb();
    return db.memories.filter((m) => m.entityId === entityId);
  },
  getLinkedMemoryIds(seedIds) {
    const db = readDb();
    const seedSet = new Set(seedIds);
    const out = new Set();
    for (const link of db.links) {
      if (seedSet.has(link.fromMemoryId) || seedSet.has(link.toMemoryId)) {
        out.add(link.fromMemoryId);
        out.add(link.toMemoryId);
      }
    }
    return [...out];
  },
  logDecision(record) {
    const db = readDb();
    db.decisions.push(record);
    writeDb(db);
    return record;
  },
  getDashboardSummary() {
    const db = readDb();
    const supplierCount = db.entities.filter((e) => e.kind === "supplier").length;
    const customerCount = db.entities.filter((e) => e.kind === "customer").length;
    const invoiceDecisions = db.decisions.filter((d) => d.output?.kind === "invoice");
    const supportDecisions = db.decisions.filter((d) => d.output?.kind === "support");
    const highRiskInvoices = invoiceDecisions.filter((d) => (d.output?.score || 0) >= 0.6).length;
    const highPrioritySupport = supportDecisions.filter((d) => d.output?.priority === "p1").length;

    return {
      suppliers: supplierCount,
      customers: customerCount,
      memories: db.memories.length,
      links: db.links.length,
      invoices: db.invoices.length,
      tickets: db.tickets.length,
      decisions: db.decisions.length,
      highRiskInvoices,
      highPrioritySupport,
      recentDecisions: db.decisions.slice(-10).reverse()
    };
  }
};
