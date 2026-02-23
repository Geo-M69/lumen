import { z } from 'zod';
export const PingEventSchema = z.object({
    type: z.literal('ping'),
    clientTime: z.number(),
});
export const ChatSendEventSchema = z.object({
    type: z.literal('chat.send'),
    nonce: z.string().min(1),
    channelId: z.string().min(1),
    content: z.string().min(1).max(4000),
});
export const RtcSignalEventSchema = z.object({
    type: z.literal('rtc.signal'),
    roomId: z.string().min(1),
    toUserId: z.string().min(1).optional(),
    payload: z.unknown(),
});
export const ClientEventSchema = z.discriminatedUnion('type', [
    PingEventSchema,
    ChatSendEventSchema,
    RtcSignalEventSchema,
]);
export const PongEventSchema = z.object({
    type: z.literal('pong'),
    clientTime: z.number(),
    serverTime: z.number(),
});
export const SystemConnectedEventSchema = z.object({
    type: z.literal('system.connected'),
    connectionId: z.string().min(1),
    serverTime: z.number(),
});
export const ChatAckEventSchema = z.object({
    type: z.literal('chat.ack'),
    nonce: z.string().min(1),
    messageId: z.string().min(1),
    channelId: z.string().min(1),
    sentAt: z.string().datetime(),
});
export const ChatBroadcastEventSchema = z.object({
    type: z.literal('chat.broadcast'),
    messageId: z.string().min(1),
    channelId: z.string().min(1),
    authorId: z.string().min(1),
    content: z.string().min(1).max(4000),
    sentAt: z.string().datetime(),
});
export const RtcSignalRelayEventSchema = z.object({
    type: z.literal('rtc.signal'),
    roomId: z.string().min(1),
    fromUserId: z.string().min(1),
    toUserId: z.string().min(1).optional(),
    payload: z.unknown(),
});
export const SystemErrorEventSchema = z.object({
    type: z.literal('system.error'),
    message: z.string().min(1),
});
export const ServerEventSchema = z.discriminatedUnion('type', [
    PongEventSchema,
    SystemConnectedEventSchema,
    ChatAckEventSchema,
    ChatBroadcastEventSchema,
    RtcSignalRelayEventSchema,
    SystemErrorEventSchema,
]);
