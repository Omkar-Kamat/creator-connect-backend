import { Plan } from "../models/plan.model.js";

export class PlanService {
  async getActivePlans() {
    return await Plan.find({ isActive: true }).sort({ price: 1 });
  }

  async getPlanByKey(planKey) {
    const plan = await Plan.findOne({
      key: planKey,
      isActive: true
    });

    if (!plan) throw new Error("Plan not found or inactive");

    return plan;
  }
}

export const planService = new PlanService();