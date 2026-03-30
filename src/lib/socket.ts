import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  path: "/backend/socket.io",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("socket conectado", socket.id);
});
 