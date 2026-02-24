import { Server } from "socket.io";
import { SocketService } from "../services/socket.service.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true
    },
    transports: ["websocket"],
    pingTimeout: 20000,
    pingInterval: 25000
  });

  io.on("connection", (socket) => {

    socket.isAuthenticated = false;

    socket.on("auth:register", async (token) => {
      if (socket.isAuthenticated) return;

      await SocketService.authenticate(socket, io, token);
    });

    socket.on("disconnect", async () => {
      await SocketService.handleDisconnect(socket, io);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err.message);
    });
  });

  process.on("SIGTERM", () => {
    io.close(() => {
      console.log("Socket server closed");
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};