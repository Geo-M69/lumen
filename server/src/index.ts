import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import {
  ClientEventSchema,
  ServerEventSchema,
  type ServerEvent,
} from '@lumen/protocol';
import type { RawData, WebSocket } from 'ws';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:1420'),
});

const env = EnvSchema.parse(process.env);

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
  },
});

await app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

await app.register(websocket);

app.get('/health', async () => ({
  status: 'ok',
  service: 'lumen-server',
  timestamp: new Date().toISOString(),
}));

app.get('/api/v1/meta', async () => ({
  name: 'lumen',
  version: '0.1.0',
  features: {
    auth: false,
    messaging: false,
    voice: false,
  },
}));

const sockets = new Set<WebSocket>();

function send(socket: WebSocket, payload: ServerEvent): void {
  socket.send(JSON.stringify(ServerEventSchema.parse(payload)));
}

function broadcast(payload: ServerEvent, except?: WebSocket): void {
  for (const socket of sockets) {
    if (socket !== except && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  }
}

app.get('/ws', { websocket: true }, (socket) => {
  sockets.add(socket);

  send(socket, {
    type: 'system.connected',
    connectionId: crypto.randomUUID(),
    serverTime: Date.now(),
  });

  socket.on('message', (data: RawData) => {
    if (typeof data !== 'string') {
      return;
    }

    let raw: unknown;

    try {
      raw = JSON.parse(data);
    } catch {
      send(socket, {
        type: 'system.error',
        message: 'Invalid JSON payload.',
      });
      return;
    }

    const parsed = ClientEventSchema.safeParse(raw);

    if (!parsed.success) {
      send(socket, {
        type: 'system.error',
        message: 'Event payload failed schema validation.',
      });
      return;
    }

    const eventPayload = parsed.data;

    if (eventPayload.type === 'ping') {
      send(socket, {
        type: 'pong',
        clientTime: eventPayload.clientTime,
        serverTime: Date.now(),
      });
      return;
    }

    if (eventPayload.type === 'chat.send') {
      const messageId = crypto.randomUUID();
      const sentAt = new Date().toISOString();

      send(socket, {
        type: 'chat.ack',
        nonce: eventPayload.nonce,
        messageId,
        channelId: eventPayload.channelId,
        sentAt,
      });

      broadcast({
        type: 'chat.broadcast',
        messageId,
        channelId: eventPayload.channelId,
        authorId: 'mvp-local-user',
        content: eventPayload.content,
        sentAt,
      });

      return;
    }

    if (eventPayload.type === 'rtc.signal') {
      broadcast(
        {
          type: 'rtc.signal',
          roomId: eventPayload.roomId,
          fromUserId: 'mvp-local-user',
          toUserId: eventPayload.toUserId,
          payload: eventPayload.payload,
        },
        socket,
      );
    }
  });

  socket.on('close', () => {
    sockets.delete(socket);
  });
});

try {
  await app.listen({
    host: env.HOST,
    port: env.PORT,
  });
} catch (error) {
  app.log.error(error, 'Failed to start server');
  process.exit(1);
}
