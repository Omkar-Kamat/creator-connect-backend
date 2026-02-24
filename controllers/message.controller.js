import { ConversationService } from "../services/message.service.js";

export class ConversationController {
    static async createConversation(req, res) {
        try {
            const userId = req.user.id;
            const { receiverId } = req.body;

            const conversation = await ConversationService.createConversation(
                userId,
                receiverId,
            );

            return res.status(201).json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getConversations(req, res) {
        try {
            const userId = req.user.id;

            const conversations =
                await ConversationService.getConversations(userId);

            return res.status(200).json({
                success: true,
                data: conversations,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getMessages(req, res) {
        try {
            const { conversationId } = req.params;

            const messages =
                await ConversationService.getMessages(conversationId);

            return res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async sendMessage(req, res) {
        try {
            const senderId = req.user.id;

            const { conversationId, receiverId, text } = req.body;

            const message = await ConversationService.sendMessage({
                conversationId,
                senderId,
                receiverId,
                text,
            });

            return res.status(201).json({
                success: true,
                data: message,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
