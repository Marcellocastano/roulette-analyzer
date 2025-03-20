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

  async updateWithNewSpin(userId, spin) {
    const stats = await this.findOrCreateUserStats(userId);
    stats.updateWithNewSpin(spin);
    await stats.save();
    return stats;
  }

  async getSpinHistory(userId, limit = 10) {
    const stats = await this.findOrCreateUserStats(userId);
    return stats.spinHistory
      .slice(-limit)
      .reverse()
      .map(spin => ({
        number: spin.number,
      }));
  }

  async removeLastSpin(userId) {
    const stats = await this.findOrCreateUserStats(userId);
    
    if (stats.spinHistory.length === 0) {
      return { success: false, message: 'No spins to remove' };
    }
    
    stats.spinHistory.pop();
    await stats.save();
    
    return { 
      success: true, 
      message: 'Spin removed successfully',
    };
  }
}

module.exports = new StatisticsRepository();
