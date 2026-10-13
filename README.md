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
