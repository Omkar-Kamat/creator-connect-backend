import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    tokens: {
      type: Number,
      required: true
    },
    bonusTokens: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

planSchema.index({ key: 1 });
planSchema.index({ isActive: 1 });

export const Plan = mongoose.model("Plan", planSchema);