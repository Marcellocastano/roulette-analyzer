const BaseRepository = require('./base.repository');
const { Spin } = require('../models');

class SpinRepository extends BaseRepository {
  constructor() {
    super(Spin);
  }

  async getRecentSpins(userId, limit = 50) {
    return await this.find(
      { user: userId },
      {
        sort: { createdAt: -1 },
        limit
      }
    );
  }

  async getSpinHistory(userId, limit = 500) {
    return await this.find(
      { user: userId },
      {
        sort: { createdAt: -1 },
        limit
      }
    );
  }

  async getUserSessionSpins(userId, sessionId) {
    return await this.find(
      { user: userId, sessionId },
      { sort: { createdAt: 1 } }
    );
  }
}

module.exports = new SpinRepository();
