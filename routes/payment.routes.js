import express from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-order",
  authMiddleware.protect.bind(authMiddleware),
  paymentController.createOrder.bind(paymentController)
);


export default router;