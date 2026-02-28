# Context and Memory Management Agent (Full-Stack Demo)

Node + Express + React implementation of a business context and memory management system.

## What It Demonstrates
- Multi-layer business context: immediate, historical, temporal, experiential.
- Memory lifecycle management: active, cooling, stale, archived.
- Relevance ranking with explainable score breakdown.
- Graph-style memory links and trend-aware conflict handling.
- Two business flows:
  - Invoice decision support
  - Support ticket escalation

## Architecture
- `client/` React dashboard
- `server/` Express API and context engine
  - `MemoryStore`
  - `ContextRetriever`
  - `RelevanceEngine`
  - `DecayManager`
  - `DecisionEngine`

## API Endpoints
- `POST /api/seed`
- `GET /api/entities`
- `GET /api/memories/:entityId`
- `POST /api/decide/invoice`
- `POST /api/decide/support`
- `GET /api/decision-log`
- `GET /api/health`

## Run Locally
1. Install server deps:
```bash
cd server && npm install
```
2. Install client deps:
```bash
cd ../client && npm install
```
3. Start backend:
```bash
cd ../server && npm run dev
```
4. Start frontend:
```bash
cd ../client && npm run dev
```
5. Open the URL printed by Vite (usually `http://localhost:5173`).

## Business Simulation
`POST /api/seed` generates deterministic mock data:
- 50 entities (suppliers + customers)
- 500 invoices
- 200 support tickets
- linked historical memory graph

## Why This Fits the Assignment
- Prioritizes context for current decisions.
- Handles freshness and staleness explicitly.
- Prevents overload with top-k and type caps.
- Resolves changing patterns using trend adjustments.
- Provides transparent, inspectable reasoning for each decision.
