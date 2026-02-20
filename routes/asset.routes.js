import express from "express";
import { assetController } from "../controllers/asset.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";

export class AssetRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            "/",
            authMiddleware.protect.bind(authMiddleware),
            multerMiddleware.single("file"),
            assetController.createAsset.bind(assetController),
        );

        this.router.get(
            "/",
            assetController.getPublicAssets.bind(assetController),
        );

        this.router.get(
            "/my",
            authMiddleware.protect.bind(authMiddleware),
            assetController.getMyAssets.bind(assetController),
        );
    }
}

export const assetRoutes = new AssetRoutes().router;
