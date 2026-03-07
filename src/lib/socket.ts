import { io } from "socket.io-client";

export const socket = io("https://fluxen.store", {
  path: "/backend/socket.io",
  transports: ["websocket"],
  secure: true,
});
