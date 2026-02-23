import express from "express";
import { ConversationController } from "../controllers/message.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/conversation",
    authMiddleware.protect.bind(authMiddleware),
    ConversationController.createConversation.bind(ConversationController),
);

router.get(
    "/conversation",
    authMiddleware.protect.bind(authMiddleware),
    ConversationController.getConversations.bind(ConversationController),
);

router.get(
    "/conversation/:conversationId/messages",
    authMiddleware.protect.bind(authMiddleware),
    ConversationController.getMessages.bind(ConversationController),
);

router.post("/message", authMiddleware.protect.bind(authMiddleware), ConversationController.sendMessage.bind(ConversationController));

export default router;
