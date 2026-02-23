# Contributing

## Development setup

1. Install Node.js 22+ and npm 10+.
2. Copy `.env.example` to `.env`.
3. Install dependencies: `npm install`.
4. Start server: `npm run dev:server`.
5. Start desktop app (native Tauri window): `npm run dev:desktop`.

## Standards

- TypeScript only for app/server packages.
- Keep protocol changes in `packages/protocol` and update both client/server consumers.
- Prefer small pull requests with clear behavior changes.

## Pull request checklist

- Code builds locally.
- Types pass for affected packages.
- Tests added/updated for behavior changes.
- Docs updated when API/protocol changes.

## Good first issues

- Documentation clarifications
- Small UI improvements in desktop client
- WebSocket protocol tests
- Message persistence unit tests
