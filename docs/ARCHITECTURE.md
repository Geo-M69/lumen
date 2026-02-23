# Architecture

## System overview

- Desktop client: Tauri + React + TypeScript
- Server: Fastify (REST + WebSocket)
- Protocol package: shared zod schemas and event types
- Storage: SQLite first, PostgreSQL later as optional target
- Deployment: single server process behind TLS reverse proxy

## Runtime components

- REST API
  - account/session endpoints (planned)
  - guild/channel management (planned)
  - invite/moderation endpoints (planned)
- WebSocket gateway
  - presence and typing signals (planned)
  - message event fan-out (M1)
  - WebRTC signaling for voice rooms (M3)
- Data layer
  - users, guilds, channels, memberships, messages, invites, audit log

## Realtime message flow (target)

1. Client sends `chat.send` with nonce.
2. Server validates, persists message, allocates sequence.
3. Server sends `chat.ack` to sender.
4. Server broadcasts `chat.broadcast` to channel subscribers.

## Voice flow (MVP)

1. Client joins voice room in channel.
2. Client exchanges offer/answer/ICE via `rtc.signal` events over WS.
3. Peers establish direct audio streams (OPUS, audio-only).
4. Server enforces room member caps for mesh viability.
