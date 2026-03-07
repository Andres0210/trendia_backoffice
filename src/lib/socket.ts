import { io } from "socket.io-client";

export const socket = io("https://fluxen.store/banckend", {
  transports: ["websocket"], // Fuerza WebSocket
  secure: true, // HTTPS
});
