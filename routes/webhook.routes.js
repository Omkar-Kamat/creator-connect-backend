import express from "express";
import { paymentController } from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
  "/webhook",express.raw({ type: "application/json" }),
  paymentController.webhook.bind(paymentController)
);

export default router;