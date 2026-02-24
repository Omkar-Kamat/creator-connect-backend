import { planService } from "../services/plan.service.js";

export class PlanController {
  async getPlans(req, res) {
    try {
      const plans = await planService.getActivePlans();
      res.json(plans);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const planController = new PlanController();