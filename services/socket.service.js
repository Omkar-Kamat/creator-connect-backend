import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { deductToken } from "../utils/deductToken.js";

export class SocketService {

  static async authenticate(socket, io, token) {
    try {
      if (!token) {
        return socket.emit("auth:error", { message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return socket.emit("auth:error", { message: "User not found" });
      }

      socket.user = user;
      socket.isAuthenticated = true;

      this.registerConnection(socket, io);

      socket.emit("auth:success", { userId: user._id });

    } catch (err) {
      socket.emit("auth:error", { message: "Authentication failed" });
    }
  }

  static registerConnection(socket, io) {
    if (!socket.isAuthenticated || !socket.user) return;

    const userId = socket.user._id.toString();

    socket.join(userId);

    io.emit("user:online", { userId });

    socket.on("chat:send", async (payload) => {
      await this.handleSendMessage(socket, io, payload);
    });

    socket.on("chat:typing", ({ receiverId }) => {
      if (!receiverId) return;
      io.to(receiverId).emit("chat:typing", { userId });
    });

    socket.on("chat:stopTyping", ({ receiverId }) => {
      if (!receiverId) return;
      io.to(receiverId).emit("chat:stopTyping", { userId });
    });

    socket.on("chat:seen", async (payload) => {
      await this.handleSeen(socket, io, payload);
    });
  }

  static async handleDisconnect(socket, io) {
    if (!socket.user) return;

    const userId = socket.user._id.toString();

    const sockets = await io.in(userId).allSockets();

    if (sockets.size === 0) {
      io.emit("user:offline", { userId });
    }
  }

  static async handleSendMessage(socket, io, payload) {
    if (!socket.isAuthenticated) return;

    const { conversationId, receiverId, text } = payload;
    const senderId = socket.user._id.toString();

    if (
      !mongoose.Types.ObjectId.isValid(conversationId) ||
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !text?.trim()
    ) {
      socket.emit("chat:error", { message: "Invalid payload" });
      return;
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const conversation = await Conversation
        .findById(conversationId)
        .session(session);

      if (!conversation) throw new Error("Conversation not found");

      const isParticipant = conversation.participants.some(
        (id) => id.toString() === senderId
      );

      if (!isParticipant) throw new Error("Unauthorized");

      await deductToken(senderId, 1, session);

      const receiverSockets = await io.in(receiverId).allSockets();

      const messageStatus =
        receiverSockets.size > 0 ? "delivered" : "sent";

      const [message] = await Message.create(
        [{
          conversation: conversationId,
          sender: senderId,
          receiver: receiverId,
          text: text.trim(),
          status: messageStatus
        }],
        { session }
      );

      conversation.lastMessage = text.trim();
      await conversation.save({ session });

      await session.commitTransaction();

      io.to(receiverId).emit("chat:receive", message);
      io.to(senderId).emit("chat:sent", message);

    } catch (err) {
      await session.abortTransaction();
      socket.emit("chat:error", { message: err.message });
    } finally {
      session.endSession();
    }
  }

  static async handleSeen(socket, io, payload) {
    if (!socket.isAuthenticated) return;

    const { conversationId, senderId } = payload;
    const receiverId = socket.user._id.toString();

    if (
      !mongoose.Types.ObjectId.isValid(conversationId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      socket.emit("chat:error", { message: "Invalid payload" });
      return;
    }

    try {
      const result = await Message.updateMany(
        {
          conversation: conversationId,
          sender: senderId,
          receiver: receiverId,
          status: { $in: ["sent", "delivered"] }
        },
        { $set: { status: "seen" } }
      );

      if (result.modifiedCount > 0) {
        io.to(senderId).emit("chat:seen", {
          conversationId,
          seenBy: receiverId
        });
      }

    } catch (err) {
      socket.emit("chat:error", { message: err.message });
    }
  }
}