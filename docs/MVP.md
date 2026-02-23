# MVP Scope

## Goal

Ship a small, self-hostable desktop app for private groups with text chat and voice rooms.

## In scope

- Local accounts and sessions
- Private servers (guilds), channels, and DMs
- Persistent message history
- Real-time text over WebSocket
- Voice rooms over WebRTC (P2P mesh)
- Invite links/codes
- Basic moderation: invite, kick, mute
- TLS deployment guidance

## Out of scope

- Federation between unrelated hosts
- SFU-based large rooms
- Advanced E2EE key management
- Any identity-verification workflow

## Milestones

- M0 (Weeks 0-2): repo scaffold, docs, API/WS stub, compose setup
- M1 (Weeks 2-6): auth, servers/channels, persisted text messaging
- M2 (Weeks 6-10): presence, typing, invites, DMs, moderation
- M3 (Weeks 10-14): P2P voice rooms, audio controls, UX polish
- M4 (Post-MVP): SFU option, E2EE prototype, scale docs
