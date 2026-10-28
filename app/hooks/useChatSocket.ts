"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Opens the Socket.io connection once `enabled` is true. The server identifies the
// user from the session cookie sent with the handshake.
export function useChatSocket(enabled: boolean): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let instance: Socket | null = null;

    const connect = async () => {
      try {
        // Hitting the route makes the server attach the Socket.io instance
        await fetch("/api/socket");
      } catch (err) {
        console.error("Failed to initialize socket server", err);
      }
      if (!active) return;
      instance = io({ path: "/api/socket" });
      setSocket(instance);
    };
    connect();

    return () => {
      active = false;
      instance?.disconnect();
    };
  }, [enabled]);

  return socket;
}
