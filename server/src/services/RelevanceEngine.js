import { getLifecycleState, stalenessPenalty } from "./DecayManager.js";

function temporalProximity(now, createdAt) {
  const age = Math.max(0, Math.floor((now - new Date(createdAt)) / (1000 * 60 * 60 * 24)));
  if (age <= 14) return 1;
  if (age <= 60) return 0.75;
  if (age <= 180) return 0.45;
  return 0.15;
}

function semanticOverlap(a, b) {
  const sa = new Set(a || []);
  const sb = new Set(b || []);
  if (!sa.size || !sb.size) return 0;
  let i = 0;
  for (const t of sa) if (sb.has(t)) i += 1;
  return i / new Set([...sa, ...sb]).size;
}

function trendByTag(memories, now) {
  const recent = new Map();
  const old = new Map();
  for (const m of memories) {
    const age = Math.max(0, Math.floor((now - new Date(m.createdAt)) / (1000 * 60 * 60 * 24)));
    for (const tag of m.tags || []) {
      const bucket = age <= 120 ? recent : old;
      const prev = bucket.get(tag) || { sum: 0, n: 0 };
      prev.sum += m.impact;
      prev.n += 1;
      bucket.set(tag, prev);
    }
  }
  const out = new Map();
  const tags = new Set([...recent.keys(), ...old.keys()]);
  for (const t of tags) {
    const r = recent.get(t) || { sum: 0, n: 1 };
    const o = old.get(t) || { sum: 0, n: 1 };
    const delta = r.sum / r.n - o.sum / o.n;
    out.set(t, Math.max(-0.1, Math.min(0.1, 0.2 * delta)));
  }
  return out;
}

export function rankContext({ memories, entityId, tags, requiredTags = [], linkedIds = [], now = new Date(), topK = 8 }) {
  const linked = new Set(linkedIds || []);
  const trend = trendByTag(memories, now);
  const scored = [];

  for (const m of memories) {
    const state = getLifecycleState(m, now);
    if (state === "archived") continue;

    const temporal = temporalProximity(now, m.createdAt);
    const relational = m.entityId === entityId ? 1 : 0.3;
    const semantic = semanticOverlap(tags, m.tags || []);
    const impact = Math.max(0, Math.min(1, m.impact || 0));
    const reliability = Math.max(0, Math.min(1, m.reliability || 0.5));
    const requiredBonus = requiredTags.some((t) => (m.tags || []).includes(t)) ? 0.15 : 0;
    const trendAdj = (m.tags || []).length
      ? (m.tags || []).reduce((s, t) => s + (trend.get(t) || 0), 0) / (m.tags || []).length
      : 0;
    const linkBoost = linked.has(m.id) ? 0.08 : 0;
    const penalty = stalenessPenalty(state);

    const score = Math.max(
      0,
      Math.min(
        1,
        0.25 * temporal + 0.25 * relational + 0.15 * semantic + 0.25 * impact + 0.1 * reliability + requiredBonus + trendAdj + linkBoost - penalty
      )
    );

    scored.push({
      memory: m,
      score,
      why: `temporal=${temporal.toFixed(2)}, relational=${relational.toFixed(2)}, semantic=${semantic.toFixed(2)}, impact=${impact.toFixed(2)}, reliability=${reliability.toFixed(2)}, required_bonus=${requiredBonus.toFixed(2)}, trend=${trendAdj.toFixed(2)}, link=${linkBoost.toFixed(2)}, state=${state}, penalty=${penalty.toFixed(2)}`
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const typeCount = new Map();
  const selected = [];
  for (const row of scored) {
    const t = row.memory.type;
    if ((typeCount.get(t) || 0) >= 2) continue;
    selected.push(row);
    typeCount.set(t, (typeCount.get(t) || 0) + 1);
    if (selected.length >= topK) break;
  }

  return selected;
}
