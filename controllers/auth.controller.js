import { authService } from "../services/auth.service.js";
import { otpService } from "../services/otp.service.js";
import { emailService } from "../services/email.service.js";

export class AuthController {

  async signup(req, res) {

    try {

      const { user, token } = await authService.registerUser(req.body);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax"
      });

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token
      });

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

  async login(req, res) {

    try {

      const { user, token } = await authService.loginUser(req.body);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax"
      });

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token
      });

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

  logout(req, res) {

    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    });

    res.json({
      message: "Logged out"
    });

  }

  async sendOtp(req, res) {

    try {

      const { email } = req.body;

      if (!email) {
        throw new Error("Email is required");
      }

      const otp = otpService.generateOtp();

      await otpService.saveOtp(email, otp);

      await emailService.sendEmail(
        email,
        "Your OTP Code",
        `Your OTP is ${otp}. It expires in 5 minutes.`
      );

      res.json({
        message: "OTP sent successfully"
      });

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

  async verifyOtp(req, res) {

    try {

      const { name, email, password, otp } = req.body;

      await otpService.verifyOtpService(email, otp);

      const { user, token } = await authService.registerUser({
        name,
        email,
        password
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax"
      });

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token
      });

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

}

export const authController = new AuthController();