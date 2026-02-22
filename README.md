# Context and Memory Management for AI Agents in Business Environments

This repository contains a prototype design plan for a business-facing AI context and memory management system.

## Objective
Build an explainable, non-LLM-first system that helps AI agents:
- maintain relevant business context across interactions,
- retrieve historical information for current decisions,
- manage memory freshness and staleness,
- avoid information overload while preserving critical signals.

## Assignment Mapping

### 1. Memory Types and Structure
Planned memory categories:
- Immediate context: current transaction/ticket facts.
- Historical context: prior interactions and outcomes.
- Temporal context: time-sensitive signals with decay.
- Experiential context: lessons from past failures/successes.

Planned data structure:
- Structured records for memory items.
- Entity-linked relationships (example: supplier -> issue -> invoice).
- Metadata for timestamps, confidence, impact, and source.

### 2. Context Hierarchy and Relevance
Planned relevance dimensions:
- Temporal proximity (recency/decay)
- Relational proximity (same entity/account/process)
- Semantic proximity (shared tags/issue type)
- Business impact (cost, SLA risk, escalation likelihood)
- Reliability (verified system events > informal notes)

Planned behavior:
- recent + high-confidence + high-impact memory should dominate,
- old/weak signals should be downweighted,
- conflicting history should be resolved by recency, reliability, and consistency.

### 3. Memory Lifecycle
Planned lifecycle states:
- Active
- Cooling
- Stale
- Archived

Planned rules:
- Time-sensitive memories decay.
- Evergreen knowledge (e.g., contract clauses) remains until superseded.
- Stale records are archived instead of deleted (auditability).
- Updates/invalidation triggered by new evidence, policy changes, or contract revisions.

### 4. Retrieval and Decision Support
Planned retrieval flow:
1. Candidate fetch by entity + time window + tags.
2. Rank with weighted scoring.
3. Apply cap/diversity limits to prevent overload.
4. Force-include critical risk memories when thresholds are crossed.

Planned output:
- top relevant context snippets,
- score/reason trace (why each memory was selected),
- decision recommendation.

## Business Scenarios to Cover
- Invoice processing risk checks (quality history, logistics issues, dispute history, seasonality).
- Customer support escalation (relationship risk, SLA sensitivity, past issue recurrence, stakeholder preference).

## Proposed Implementation Roadmap
1. Project scaffold and architecture docs.
2. Memory schema and linked context model.
3. Lifecycle and staleness rules.
4. Retrieval ranking engine.
5. Invoice decision module.
6. Support ticket decision module.
7. Tests and seeded scenario data.

## Success Criteria
- Explainable context retrieval (clear rationale per retrieved memory).
- Practical staleness management.
- Scalable structure for large business datasets.
- Deterministic baseline without dependency on LLM reasoning.

## Current Prototype Files
- `src/memory_models.py`: memory and query data model.
- `src/lifecycle.py`: memory freshness/staleness transitions.
- `src/retrieval.py`: weighted ranking with explanation string.
- `src/decision_invoice.py`: invoice action recommendation.
- `src/decision_support.py`: support escalation recommendation.
- `src/sample_data.py`: JSON seed loader.
- `src/demo.py`: executable demo for both scenarios.
- `src/db.py`: SQLite persistence and query layer.
- `src/api.py`: FastAPI backend with ingestion and decision endpoints.
- `frontend/`: browser UI for seeding and decision workflows.
- `data/sample_seed.json`: realistic seed records.
- `tests/`: retrieval + scenario-level tests.

## How to Run
From repository root:

```bash
python3 -m src.demo
```

Run tests:

```bash
python3 -m pytest -q
```

If `pytest` is not installed:

```bash
python3 -m pip install pytest
```

Run backend API:

```bash
python3 -m pip install -r requirements.txt
uvicorn src.api:app --reload
```

Optional API key protection:

```bash
export API_KEY="intern-demo-key"
uvicorn src.api:app --reload
```

When API key is set, pass header on API calls:

```text
x-api-key: intern-demo-key
```

Open frontend UI:

```text
http://127.0.0.1:8000/ui
```

Frontend flow:
1. Click `Seed Sample Data`.
2. Submit `Invoice Decision`.
3. Submit `Support Escalation`.

Seed sample memories:

```bash
curl -X POST http://127.0.0.1:8000/memories/seed \
  -H "Content-Type: application/json" \
  -H "x-api-key: intern-demo-key" \
  -d '{"json_path":"data/sample_seed.json"}'
```

Manage explicit memory links:

```bash
curl -X POST http://127.0.0.1:8000/links \
  -H "Content-Type: application/json" \
  -H "x-api-key: intern-demo-key" \
  -d '[
    {
      "link_id":"LNK-100",
      "tenant_id":"acme",
      "from_memory_id":"SUP-001",
      "to_memory_id":"SUP-003",
      "relation_type":"causal",
      "weight":0.8,
      "created_at":"2026-02-25T10:00:00+05:30"
    }
  ]'

curl "http://127.0.0.1:8000/links?tenant_id=acme&limit=50" \
  -H "x-api-key: intern-demo-key"
```

Example invoice decision call:

```bash
curl -X POST http://127.0.0.1:8000/invoice/decision \
  -H "Content-Type: application/json" \
  -H "x-api-key: intern-demo-key" \
  -d '{
    "tenant_id":"acme",
    "supplier_id":"supplier_xyz",
    "invoice_amount":250000,
    "invoice_date":"2026-02-25T10:00:00+05:30",
    "invoice_tags":["quality_issue","seasonal_risk","logistics_delay"]
  }'
```

Example support escalation call:

```bash
curl -X POST http://127.0.0.1:8000/support/escalation \
  -H "Content-Type: application/json" \
  -H "x-api-key: intern-demo-key" \
  -d '{
    "tenant_id":"acme",
    "customer_id":"techcorp_inc",
    "ticket_time":"2026-02-25T11:00:00+05:30",
    "ticket_tags":["integration_issue","sla_risk","api_dependency"]
  }'
```

## Design Tradeoffs (For Internship Discussion)
- Deterministic logic over LLM reasoning: easier auditability and repeatable outputs.
- Stale memory handling: archived data retained for audit, excluded from default top-k.
- Conflict handling: contradictory memories are downweighted when stronger evidence exists.
- Overload control: top-k plus per-type cap avoids flooding decision modules.
- Privacy baseline: tenant_id filtering prevents cross-tenant retrieval leakage.
- Conflict/trend handling: newer pattern can downweight older contradictory behavior.
- Link-aware recall: graph links allow connected events to influence ranking decisions.
