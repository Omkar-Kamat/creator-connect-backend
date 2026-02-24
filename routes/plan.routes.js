import express from "express";
import { planController } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/", planController.getPlans.bind(planController));

export default router;