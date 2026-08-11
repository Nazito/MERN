import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket: Socket | null = null;

type SocketEventHandler = (event: string, payload: unknown) => void;
const subscribers = new Set<SocketEventHandler>();

function attachBridge(target: Socket) {
  if ((target as Socket & { __bridge?: boolean }).__bridge) return;
  (target as Socket & { __bridge?: boolean }).__bridge = true;

  target.onAny((event, payload) => {
    subscribers.forEach((handler) => {
      try {
        handler(event, payload);
      } catch (err) {
        console.error("[socket] subscriber error", err);
      }
    });
  });

  target.on("connect_error", (err) => {
    console.warn("[socket] connect_error:", err.message);
  });
}

export function getSocket() {
  return socket;
}

export function isSocketConnected() {
  return Boolean(socket?.connected);
}

/** Stable subscribe — survives React Strict Mode remounts */
export function subscribeSocket(handler: SocketEventHandler) {
  subscribers.add(handler);
  return () => {
    subscribers.delete(handler);
  };
}

export function connectSocket(token: string) {
  if (socket) {
    const auth = socket.auth as { token?: string } | undefined;
    if (auth?.token !== token) {
      socket.auth = { token };
      if (socket.connected) {
        socket.disconnect().connect();
      }
    }
    if (!socket.connected) {
      socket.connect();
    }
    attachBridge(socket);
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 800,
  });

  attachBridge(socket);
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
