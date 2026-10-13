# DailyBet Frontend

Responsive sportsbook frontend built with Next.js App Router, TypeScript, Tailwind CSS v4 and Lucide icons. Brand colors: DailyBet navy `#071B49` and blue `#1769E0`.

## Requirements
- Node.js 20.9+
- npm 10+ (or pnpm)

## Local development
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## Railway deployment
1. Deploy this repository as its own Railway service.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the public URL of the DailyBet backend plus `/api/v1` (for example, `https://your-backend-domain/api/v1`).
3. Generate a Railway public domain for the frontend.
4. Add that exact frontend origin to the backend's `CORS_ORIGINS` variable.
5. Redeploy both services after updating variables.

Railway's `railway.json` specifies the build/start commands and uses `/api/health` for its health check. The frontend service does not need BetConstruct credentials.

## Quality checks
```bash
npm run typecheck
npm run lint
npm run build
```

## Current status
The UI uses clearly labelled illustrative fixture/odds data to demonstrate layout and bet-slip interactions. It does not accept real bets, process payments, authenticate customers, or fetch live sports data. Do not deploy as a real-money sportsbook until licensed provider, wallet, payments, settlement, fraud controls, security reviews, and Uganda regulatory requirements are implemented and verified.

## Architecture direction
- UI: Next.js App Router, TypeScript, Tailwind CSS
- API: separate TypeScript service in `dailybet-dev/db_backend`
- Data: PostgreSQL with Prisma; Redis for cache/queues as the backend evolves
- Integrations: provider adapters behind server-side interfaces; credentials only in server-side environment variables
