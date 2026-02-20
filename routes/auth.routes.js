import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/signup", authController.signup.bind(authController));

        this.router.post("/login", authController.login.bind(authController));

        this.router.get(
            "/me",
            authMiddleware.protect.bind(authMiddleware),
            this.me.bind(this),
        );

        this.router.post("/logout", authController.logout.bind(authController));

        this.router.post(
            "/send-otp",
            authController.sendOtp.bind(authController),
        );

        this.router.post(
            "/verify-otp",
            authController.verifyOtp.bind(authController),
        );
    }

    me(req, res) {
        res.json(req.user);
    }
}

export const authRoutes = new AuthRoutes().router;
