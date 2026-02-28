# Context and Memory Management Agent

Full-stack web app (React + Node/Express) for business decision support using contextual memory.

## Use the Deployed App

### 1. Open the app
- Deployed URL: `ADD_YOUR_DEPLOYED_LINK_HERE`

### 2. Seed demo data (first step)
- Go to **Dashboard**
- Click **Seed Simulation Data**
- This creates sample suppliers, customers, memories, invoices, tickets, and links.

### 3. Run Invoice decision
- Open **Invoice Decision** page
- Select a supplier
- Set invoice amount and risk tags
- Click **Evaluate Invoice**
- Review:
  - Final decision highlight
  - Recommended steps
  - Context evidence ranking

### 4. Run Support escalation
- Open **Support Escalation** page
- Select a customer
- Set support risk tags
- Click **Evaluate Support Ticket**
- Review:
  - Priority and escalation path
  - Stakeholders and signals
  - Context evidence ranking

### 5. Explore data and audit trail
- **Memory Explorer**: inspect stored memories for any entity
- **Decision Logs**: see historical decision outputs and scores

## App Navigation (Pages)
- **Dashboard**: overall metrics + recent decisions
- **Invoice Decision**: invoice risk evaluation flow
- **Support Escalation**: support priority/escalation flow
- **Memory Explorer**: memory inspection by entity
- **Decision Logs**: decision history/audit view

## What This App Demonstrates
- Immediate + historical + temporal + experiential context usage
- Memory lifecycle awareness (freshness and decay effects)
- Relevance ranking with explainable score factors
- Linked memory retrieval and trend-aware scoring
- Business-ready decision outputs (not just raw model scores)

## Run Locally (Developer)
1. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```
2. Run backend:
```bash
cd ../server && npm run dev
```
3. Run frontend:
```bash
cd ../client && npm run dev
```
4. Open:
```text
http://127.0.0.1:5173
```

## API Routes (Reference)
- `POST /api/seed`
- `GET /api/dashboard-summary`
- `GET /api/entities`
- `GET /api/memories/:entityId`
- `POST /api/decide/invoice`
- `POST /api/decide/support`
- `GET /api/decision-log`
- `GET /api/health`
