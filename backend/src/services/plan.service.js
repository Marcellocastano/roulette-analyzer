const { planRepository } = require('../repositories');

class PlanService {
  async getPlans() {
    return await planRepository.findActivePlans();
  }
}

module.exports = PlanService;
