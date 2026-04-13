# Routine Tracker & Accountability App

Full-stack cross-platform app built with React Native (Expo) + Node.js/Express + MongoDB.

## Structure
- `backend/` — Express API with modular routes, JWT auth, gamification, couple mode, penalties, analytics, AI suggestions stub, CSV export.
- `mobile/` — Expo React Native client with NativeWind styles, Zustand state, offline queue, charts, notifications placeholder.
- `scripts/` — Utility scripts (seed, etc.).

## Backend Setup
1. `cd backend`
2. `cp .env.example .env` and fill `MONGO_URI`, `JWT_SECRET`, etc.
3. `pnpm install` (or `npm install`).
4. `pnpm dev` to run locally with nodemon.
5. Use `pnpm ts-node src/scripts/seed.ts` for demo data.

## Mobile App Setup
1. `cd mobile`
2. `cp .env.example .env` and set `EXPO_PUBLIC_API_URL=http://<local-ip>:4000/api`.
3. `pnpm install`
4. `pnpm start` to launch Expo.
5. Use Expo Go on Android/iOS or run `pnpm android` / `pnpm ios` after configuring native builds.

## Key Features
- Email/password auth + JWT sessions.
- Routine CRUD, completion tracking, progress ring.
- Analytics charts (line & bar) via Victory Native.
- Couple mode invites & acceptance, shared performance.
- Penalty assignment & resolution.
- AI suggestion placeholder (extendable to OpenAI).
- CSV export for data portability.
- Offline queue for completion actions.

## Testing & Deployment
- Add MongoDB Atlas + cloud host (Render/Fly/Heroku). Use `pnpm build && pnpm start` on backend.
- Configure Expo push notifications and EAS build for stores.
- Extend Jest tests in both backend/mobile as needed.
