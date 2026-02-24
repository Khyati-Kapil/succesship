import { MemoryStore } from "./MemoryStore.js";
import { rankContext } from "./RelevanceEngine.js";

export function retrieveContext({ entityId, tags, requiredTags, now }) {
  const db = MemoryStore.getAll();
  const entityMemories = db.memories.filter((m) => m.entityId === entityId);
  const seedIds = entityMemories.map((m) => m.id);
  const linkedIds = MemoryStore.getLinkedMemoryIds(seedIds);

  return rankContext({
    memories: db.memories,
    entityId,
    tags,
    requiredTags,
    linkedIds,
    now: now ? new Date(now) : new Date()
  });
}
