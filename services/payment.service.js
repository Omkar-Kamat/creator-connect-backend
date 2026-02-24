import crypto from "crypto";
import mongoose from "mongoose";
import { razorpayService } from "../config/razorpay.config.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { planService } from "./plan.service.js";
import { Plan } from "../models/plan.model.js";

export class PaymentService {
    async createOrder(userId, planKey) {
        const plan = await planService.getPlanByKey(planKey);

        const order = await razorpayService.getClient().orders.create({
            amount: plan.price,
            currency: plan.currency,
            receipt: `receipt_${Date.now()}`,
        });

        await Payment.create({
            user: userId,
            razorpayOrderId: order.id,
            plan: plan.key,
            amount: plan.price,
            status: "created",
        });

        return order;
    }

    async verifyWebhook(signature, rawBody) {
        if (!signature) {
            throw new Error("Missing Razorpay signature");
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature),
        );

        if (!isValid) {
            throw new Error("Invalid webhook signature");
        }

        const payload = JSON.parse(rawBody.toString());

        if (payload.event !== "payment.captured") {
            return;
        }

        const paymentData = payload.payload.payment.entity;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const payment = await Payment.findOne({
                razorpayOrderId: paymentData.order_id,
                status: "created",
            }).session(session);

            if (!payment) {
                await session.abortTransaction();
                return;
            }

            if (paymentData.amount !== payment.amount) {
                throw new Error("Payment amount mismatch");
            }

            const plan = await Plan.findOne({ key: payment.plan }).session(
                session,
            );

            if (!plan) {
                throw new Error("Associated plan not found");
            }

            const totalTokens = plan.tokens + plan.bonusTokens;

            await User.findByIdAndUpdate(
                payment.user,
                { $inc: { tokens: totalTokens } },
                { session },
            );

            payment.status = "paid";
            payment.razorpayPaymentId = paymentData.id;
            payment.razorpaySignature = signature;

            await payment.save({ session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async verifyPaymentManually({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    }) {
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            throw new Error("Missing payment verification parameters");
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(razorpaySignature),
        );

        if (!isValid) {
            throw new Error("Invalid payment signature");
        }

        const razorpayPayment = await razorpayService
            .getClient()
            .payments.fetch(razorpayPaymentId);

        if (razorpayPayment.status !== "captured") {
            throw new Error("Payment not captured");
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const payment = await Payment.findOne({
                razorpayOrderId,
                status: "created",
            }).session(session);

            if (!payment) {
                await session.abortTransaction();
                return;
            }

            if (razorpayPayment.amount !== payment.amount) {
                throw new Error("Payment amount mismatch");
            }

            const plan = await Plan.findOne({ key: payment.plan }).session(
                session,
            );

            if (!plan) {
                throw new Error("Associated plan not found");
            }

            const totalTokens = plan.tokens + plan.bonusTokens;

            await User.findByIdAndUpdate(
                payment.user,
                { $inc: { tokens: totalTokens } },
                { session },
            );

            payment.status = "paid";
            payment.razorpayPaymentId = razorpayPaymentId;
            payment.razorpaySignature = razorpaySignature;

            await payment.save({ session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export const paymentService = new PaymentService();
