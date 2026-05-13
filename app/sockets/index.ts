import { getToken } from "@/lib/cookies";
import { io } from "socket.io-client";

const DEFAULT_URL = process.env.NEXT_PUBLIC_API_URL;

export function createSocket({ url = DEFAULT_URL } = {}) {
  const authToken = getToken();

  const socket = io(url, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    // Provide token in several places to maximize compatibility with different server setups
    auth: { token: `${authToken}` },
    query: { token: `${authToken}` },
    transportOptions: {
      polling: {
        extraHeaders: authToken
          ? {
              token: ` ${authToken}`,
              authorization: ` ${authToken}`,
            }
          : {},
      },
    },
  });

  socket.on("connect", () => console.log("Socket connected"));

  const connect = () => {
    console.log("Socket connecting");
    socket.connect();
  };

  const disconnect = () => socket.disconnect();

  // Safe emit wrapper
  const emit = (event: any, ...args: any) => {
    if (socket && socket.connected) socket.emit(event, ...args);
  };

  return {
    socket,
    connect,
    disconnect,
    emit,
  };
}

export default createSocket;
