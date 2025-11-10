## FuelEU Maritime – Compliance Dashboard (Frontend & Backend)

### Overview
Minimal FuelEU Maritime module with Routes, Compare, Banking, and Pooling. Hexagonal architecture across frontend (React/TS/Tailwind) and backend (Node/TS/PostgreSQL).

### Architecture Summary
- Core: domain, application use-cases, ports (framework-agnostic)
- Adapters:
  - Inbound: HTTP controllers (backend), UI components/hooks (frontend)
  - Outbound: Postgres repositories (backend), HTTP API clients (frontend)
- Infrastructure: Express server, DB client, schema/migrations

### Setup
1) Backend
- Requirements: Node 18+, PostgreSQL
- Env: create `backend/.env` with `DATABASE_URL=postgres://user:pass@localhost:5432/fueleu`
- Install: `cd backend && npm i`
- DB: `npm run migrate && npm run seed`
- Dev: `npm run dev` (http://localhost:3000)

2) Frontend
- Install: `cd frontend && npm i`
- Dev: `npm run dev` (http://localhost:5173)

### API Samples
- GET `/routes` and POST `/routes/:id/baseline`
- GET `/routes/comparison` → baseline vs others, includes `percentDiff`, `compliant`
- GET `/compliance/cb?shipId=R001&year=2025`
- GET `/compliance/adjusted-cb?year=2025`
- POST `/banking/bank` { shipId, year }
- POST `/banking/apply` { shipId, year, amount }
- GET `/banking/records?shipId=R001&year=2025`
- POST `/pools` { year, shipIds }
 



### Testing
Backend:
- Unit: `npm run test` (Jest)
- Add tests under `backend/tests`

Frontend:
- Unit: `npm run test` (Vitest)
- Add tests under `frontend/src/__tests__`

### Screenshots / Examples
- Compare Tab: shows baseline vs actual with compliance and chart.
- Banking Tab: CB before, applied, after; bank/apply actions with records.
- Pooling Tab: adjusted CB per ship, validation, and result members/CBs.







