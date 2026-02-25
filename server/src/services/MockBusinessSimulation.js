import { generateBusinessData } from "./seedGenerator.js";
import { MemoryStore } from "./MemoryStore.js";

export function runSimulationSeed() {
  const data = generateBusinessData();
  MemoryStore.reset(data);
  return {
    suppliers: data.entities.filter((e) => e.kind === "supplier").length,
    customers: data.entities.filter((e) => e.kind === "customer").length,
    invoices: data.invoices.length,
    tickets: data.tickets.length,
    memories: data.memories.length,
    links: data.links.length
  };
}
