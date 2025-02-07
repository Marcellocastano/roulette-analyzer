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

  async removeSpinFromHistory(userId, spinId) {
    const stats = await this.findOrCreateUserStats(userId);
    
    // Trova l'indice dello spin da rimuovere
    const spinIndex = stats.spinHistory.findIndex(spin => 
      spin.foreignSpinId.toString() === spinId.toString()
    );

    if (spinIndex !== -1) {
      // Rimuovi lo spin dalla storia
      stats.spinHistory.splice(spinIndex, 1);

      // Ricalcola le statistiche
      const last50Spins = stats.spinHistory.slice(-50);
      const last500Spins = stats.spinHistory;

      // Resetta le statistiche
      stats._resetStats('stats50');
      stats._resetStats('stats500');

      // Aggiorna le statistiche per ogni intervallo
      last50Spins.forEach(spin => {
        stats._updateStatsForRange('stats50', spin.number);
      });

      last500Spins.forEach(spin => {
        stats._updateStatsForRange('stats500', spin.number);
      });

      await stats.save();
    }

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
