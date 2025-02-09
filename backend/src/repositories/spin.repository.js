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

  async getSessionSpins(sessionId) {
    return await this.find(
      { sessionId },
      { sort: { createdAt: 1 } }
    );
  }

  async getUserSessionSpins(userId, sessionId) {
    return await this.find(
      { user: userId, sessionId },
      { sort: { createdAt: 1 } }
    );
  }

  async getDozensStats(userId, limit = 50) {
    return await this.model.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $group: {
          _id: '$metadata.dozen',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          dozen: '$_id',
          count: 1,
          percentage: {
            $multiply: [
              { $divide: ['$count', limit] },
              100
            ]
          }
        }
      }
    ]);
  }
}

module.exports = new SpinRepository();
