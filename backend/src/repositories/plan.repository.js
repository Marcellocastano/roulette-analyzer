const BaseRepository = require('./base.repository');
const { Plan } = require('../models');

class PlanRepository extends BaseRepository {
  constructor() {
    super(Plan);
  }

  async findActivePlans() {
    return await this.find({ isActive: true });
  }

  async findById(planId) {
    return await this.findOne({ _id: planId });
  }

  async findByType(type) {
    return await this.findOne({ type });
  }

  async findByTypeAndDuration(type, duration) {
    return await this.findOne({ type, duration });
  }
}

module.exports = new PlanRepository();
