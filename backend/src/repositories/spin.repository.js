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

  async getZeroNeighborsStats(userId, limit = 50) {
    return await this.model.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $group: {
          _id: '$metadata.isZeroNeighbor',
          count: { $sum: 1 },
          numbers: {
            $push: {
              number: '$number',
              timestamp: '$createdAt'
            }
          }
        }
      }
    ]);
  }

  async getHotNumbers(userId, limit = 50) {
    const threshold = Math.ceil(limit / 37 * 1.5); // 50% più della media attesa
    return await this.model.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $group: {
          _id: '$number',
          count: { $sum: 1 },
          lastSeen: { $max: '$createdAt' }
        }
      },
      {
        $match: {
          count: { $gte: threshold }
        }
      },
      {
        $project: {
          number: '$_id',
          count: 1,
          percentage: {
            $multiply: [
              { $divide: ['$count', limit] },
              100
            ]
          },
          lastSeen: 1
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getColdNumbers(userId, limit = 50) {
    return await this.model.aggregate([
      { $match: { user: userId } },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $group: {
          _id: '$number',
          count: { $sum: 1 },
          lastSeen: { $max: '$createdAt' }
        }
      },
      {
        $match: {
          count: { $lte: 1 }
        }
      },
      {
        $project: {
          number: '$_id',
          count: 1,
          lastSeen: 1,
          daysSinceLastSeen: {
            $divide: [
              { $subtract: [new Date(), '$lastSeen'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      { $sort: { lastSeen: 1 } }
    ]);
  }
}

module.exports = new SpinRepository();
