import { LifecycleStates, MemoryTypes } from "../models/Memory.js";

export function getLifecycleState(memory, now) {
  if (memory.supersededAt && new Date(memory.supersededAt) <= now) return LifecycleStates.ARCHIVED;
  if (memory.type === MemoryTypes.POLICY) return LifecycleStates.ACTIVE;

  const ageDays = Math.max(0, Math.floor((now - new Date(memory.createdAt)) / (1000 * 60 * 60 * 24)));
  if (ageDays <= 45) return LifecycleStates.ACTIVE;
  if (ageDays <= 180) return LifecycleStates.COOLING;
  if (ageDays <= 720) return LifecycleStates.STALE;
  return LifecycleStates.ARCHIVED;
}

export function stalenessPenalty(state) {
  if (state === LifecycleStates.ACTIVE) return 0;
  if (state === LifecycleStates.COOLING) return 0.08;
  if (state === LifecycleStates.STALE) return 0.2;
  return 0.4;
}
