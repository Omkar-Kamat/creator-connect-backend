import mongoose from "mongoose";
import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js";

export class ConversationService {
    static async createConversation(userId, receiverId) {
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            throw new Error("Invalid receiver ID");
        }

        if (userId.toString() === receiverId.toString()) {
            throw new Error("Cannot create conversation with yourself");
        }

        const existing = await Conversation.findOne({
            participants: { $all: [userId, receiverId] },
        });

        if (existing) return existing;

        const conversation = await Conversation.create({
            participants: [userId, receiverId],
        });

        return conversation;
    }

    static async getConversations(userId) {
        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate("participants", "name email")
            .sort({ updatedAt: -1 });

        return conversations;
    }

    static async getMessages(conversationId) {
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            throw new Error("Invalid conversation ID");
        }

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate("sender", "name")
            .populate("receiver", "name")
            .sort({ createdAt: 1 });

        return messages;
    }

    static async sendMessage({ conversationId, senderId, receiverId, text }) {
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            throw new Error("Invalid conversation ID");
        }

        if (!text || !text.trim()) {
            throw new Error("Message cannot be empty");
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: senderId,
            receiver: receiverId,
            text: text.trim(),
            status: "sent",
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text.trim(),
        });

        return message;
    }
}

