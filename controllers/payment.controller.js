import { paymentService } from "../services/payment.service.js";

export class PaymentController {
  async createOrder(req, res) {
    try {
      const order = await paymentService.createOrder(
        req.user._id,
        req.body.plan
      );

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async webhook(req, res) {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const rawBody = req.body;

      await paymentService.verifyWebhook(signature, rawBody);

      res.json({ status: "ok" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const paymentController = new PaymentController();