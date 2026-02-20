import { Otp } from "../models/otp.model.js";

export class OtpService {

  generateOtp() {

    return Math.floor(100000 + Math.random() * 900000).toString();

  }

  async saveOtp(email, otp) {

    try {

      if (!email) {
        throw new Error("Email is required");
      }

      if (!otp) {
        throw new Error("OTP is required");
      }

      await Otp.deleteMany({ email });

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const res = await Otp.create({
        email,
        otp,
        expiresAt
      });

      console.log("otp created", res);

      return true;

    } catch (error) {

      console.error("OtpService.saveOtp Error:", error.message);
      throw error;

    }

  }

  async verifyOtpService(email, otp) {

    try {

      if (!email || !otp) {
        throw new Error("Email and OTP are required");
      }

      const record = await Otp.findOne({ email, otp });

      if (!record) {
        throw new Error("Invalid OTP");
      }

      if (record.expiresAt < new Date()) {
        throw new Error("OTP expired");
      }

      await Otp.deleteMany({ email });

      return true;

    } catch (error) {

      console.error("OtpService.verifyOtpService Error:", error.message);
      throw error;

    }

  }

}

export const otpService = new OtpService();