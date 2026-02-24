import Razorpay from "razorpay";

export class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  getClient() {
    return this.instance;
  }
}

export const razorpayService = new RazorpayService();