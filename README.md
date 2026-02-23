# lumen

Private, self-hostable chat and voice app for small communities.

## Monorepo layout

- `apps/lumen`: Tauri desktop app (React + TypeScript)
- `server`: Fastify API + WebSocket signaling server
- `packages/protocol`: Shared runtime event schemas and TypeScript types
- `infra`: Docker Compose and deployment scaffolding
- `docs`: Architecture, roadmap, and contributor docs

## Quick start

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Start server: `npm run dev:server`.
4. Run desktop app (separate shell): `npm run dev:desktop`.

## Docker

Use Docker Compose for local server development:

```bash
cd infra
docker compose up --build
```

The server listens on `http://localhost:4000`.

## License

This repository is split-licensed by component:

- `server/`: `AGPL-3.0-or-later`
- `apps/lumen/` (Tauri app + UI): `MPL-2.0`
- `packages/protocol/`: `AGPL-3.0-or-later OR MPL-2.0`

See `LICENSE`, `licenses/agpl-3.0.txt`, and `licenses/mpl-2.0.txt`.
