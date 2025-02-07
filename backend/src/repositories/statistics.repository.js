const Statistics = require('../models/statistics.model');

class StatisticsRepository {
  async findOrCreateUserStats(userId) {
    let stats = await Statistics.findOne({ user: userId });
    if (!stats) {
      stats = new Statistics({ user: userId });
      await stats.save();
    }
    return stats;
  }

  async updateWithNewSpin(userId, number) {
    const stats = await this.findOrCreateUserStats(userId);
    stats.updateWithNewSpin(number);
    await stats.save();
    return stats;
  }

  async getDozensStats(userId, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return stats[statsKey].dozens;
  }

  async getZeroNeighborsStats(userId, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return stats[statsKey].zeroNeighbors;
  }

  async getHotNumbers(userId, limit = 5, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return stats[statsKey].hotNumbers.slice(0, limit);
  }

  async getColdNumbers(userId, limit = 5, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return stats[statsKey].coldNumbers.slice(0, limit);
  }

  async getSequences(userId, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return stats[statsKey].sequences;
  }

  async getSpinHistory(userId, limit = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    return stats.spinHistory.slice(-limit).reverse();
  }

  async getStats(userId, spinRange = 500) {
    const stats = await this.findOrCreateUserStats(userId);
    const statsKey = spinRange <= 50 ? 'stats50' : 'stats500';
    return {
      dozens: stats[statsKey].dozens,
      zeroNeighbors: stats[statsKey].zeroNeighbors,
      hotNumbers: stats[statsKey].hotNumbers,
      coldNumbers: stats[statsKey].coldNumbers,
      sequences: stats[statsKey].sequences,
      spinRange
    };
  }
}

module.exports = new StatisticsRepository();
