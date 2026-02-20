import mongoose from "mongoose";

export class OtpModel {

  static schema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true
      },
      otp: {
        type: String,
        required: true
      },
      expiresAt: {
        type: Date,
        required: true
      }
    },
    {
      timestamps: true
    }
  );

  static model = mongoose.model("Otp", OtpModel.schema);

}

export const Otp = OtpModel.model;