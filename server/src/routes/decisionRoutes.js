import express from "express";
import { MemoryStore } from "../services/MemoryStore.js";
import { decideInvoice, decideSupport } from "../services/DecisionEngine.js";
import { runSimulationSeed } from "../services/MockBusinessSimulation.js";

const router = express.Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

router.post("/seed", (_, res) => {
  const seeded = runSimulationSeed();
  res.json({ seeded });
});

router.get("/entities", (req, res) => {
  res.json({ entities: MemoryStore.getEntities(req.query.kind) });
});

router.get("/memories/:entityId", (req, res) => {
  res.json({ memories: MemoryStore.getMemoriesByEntity(req.params.entityId) });
});

router.post("/decide/invoice", (req, res) => {
  const result = decideInvoice(req.body || {});
  res.json(result);
});

router.post("/decide/support", (req, res) => {
  const result = decideSupport(req.body || {});
  res.json(result);
});

router.get("/decision-log", (_, res) => {
  res.json({ decisions: MemoryStore.getAll().decisions.slice(-50).reverse() });
});

router.get("/dashboard-summary", (_, res) => {
  res.json(MemoryStore.getDashboardSummary());
});

export default router;
