import User from "../models/User.js";
import Otp from "../models/Otp.js";

import {
    generateOtp,
    hashOtp,
    getOtpExpiry,
    compareOtp,
} from "../utils/otp.js";

import {
    generateAccessToken
} from "../utils/jwt.js";

import EmailService from "./email.service.js";
import AppError from "../utils/appError.js";

class AuthService {
    // register
    static async register(data) {
        const { name, email, password } =
            data;

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({email: normalizedEmail});

        if (existingUser) {
            throw new AppError("User already exists", 409);
        }

        const session = await User.startSession();
        session.startTransaction();

        try {
            const user = await User.create(
                [
                    {
                        name,
                        email: normalizedEmail,
                        password
                    },
                ],
                { session },
            );

            const otp = generateOtp();
            const hashedOtp = await hashOtp(otp);

            await Otp.create(
                [
                    {
                        email,
                        hashedOtp,
                        expiresAt: getOtpExpiry(),
                    },
                ],
                { session },
            );

            await EmailService.sendOtpEmail(normalizedEmail, otp);

            await session.commitTransaction();
            session.endSession();

            return {
                message: "Registration successful. OTP sent for verification.",
            };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }

    // verify otp
    static async verifyAccount(email, otpInput) {
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({email: normalizedEmail});

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const otpRecord = await Otp.findOne({
         email: normalizedEmail
        }).select("+hashedOtp");

        if (!otpRecord) {
            throw new AppError("OTP not found or expired", 400);
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new AppError("OTP expired", 400);
        }

        const isMatch = await compareOtp(otpInput, otpRecord.hashedOtp);

        if (!isMatch) {
            throw new AppError("Invalid OTP", 400);
        }

        await user.save();

        await Otp.deleteOne({ _id: otpRecord._id });

        return {
            message: "Account verified successfully",
        };
    }

    // login
    static async login(email, password) {
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({email: normalizedEmail}).select("+password");

        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        const payload = {
            userId: user._id,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);

        await user.save();

        return {
            accessToken
        };
    }
    
}

export default AuthService;
