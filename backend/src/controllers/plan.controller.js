const { PlanService } = require('../services');

class PlanController {
  constructor() {
    this.planService = new PlanService();
  }

  getPlans = async (req, res, next) => {
    try {
      const plans = await this.planService.getPlans();
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlanController;
