const BaseRepository = require('./base.repository');
const { Statistics } = require('../models');

class StatisticsRepository extends BaseRepository {
  constructor() {
    super(Statistics);
  }

  async findOrCreateUserStats(userId) {
    let stats = await this.findOne({ user: userId });
    
    if (!stats) {
      stats = await this.create({
        user: userId,
        generalStats: {
          totalSpins: 0,
          lastUpdate: new Date(),
          timeRange: {
            start: new Date(),
            end: new Date()
          }
        }
      });
    }
    
    return stats;
  }

  async updateWithNewSpin(userId, spin) {
    const stats = await this.findOrCreateUserStats(userId);
    return await stats.updateWithNewSpin(spin);
  }

  async getDozensStats(userId) {
    const stats = await this.findOne(
      { user: userId },
      { select: 'dozens generalStats.totalSpins' }
    );
    return stats ? stats.dozens : null;
  }

  async getZeroNeighborsStats(userId) {
    const stats = await this.findOne(
      { user: userId },
      { select: 'zeroNeighbors generalStats.totalSpins' }
    );
    return stats ? stats.zeroNeighbors : null;
  }

  async getHotNumbers(userId, limit = 5) {
    const stats = await this.findOne(
      { user: userId },
      { select: 'hotNumbers' }
    );
    
    return stats ? 
      stats.hotNumbers
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, limit) : 
      [];
  }

  async getColdNumbers(userId, limit = 5) {
    const stats = await this.findOne(
      { user: userId },
      { select: 'coldNumbers' }
    );
    
    return stats ? 
      stats.coldNumbers
        .sort((a, b) => b.missedSpins - a.missedSpins)
        .slice(0, limit) : 
      [];
  }

  async getPredictions(userId) {
    const stats = await this.findOne(
      { user: userId },
      { select: 'predictions' }
    );
    
    if (!stats || !stats.predictions) {
      return {
        recommendedNumbers: [],
        lastCalculated: null,
        accuracy: 0
      };
    }

    // Aggiorna le predizioni se sono vecchie di più di 5 minuti
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (!stats.predictions.lastCalculated || stats.predictions.lastCalculated < fiveMinutesAgo) {
      // TODO: Implementare la logica di calcolo delle predizioni
      stats.predictions.lastCalculated = new Date();
      await stats.save();
    }

    return stats.predictions;
  }

  async updatePredictionAccuracy(userId, wasCorrect) {
    const stats = await this.findOne({ user: userId });
    if (!stats || !stats.predictions) return;

    // Aggiorna l'accuratezza usando una media mobile
    const currentAccuracy = stats.predictions.accuracy || 0;
    const weight = 0.1; // Peso per la media mobile
    const newAccuracy = (currentAccuracy * (1 - weight)) + (wasCorrect ? 100 : 0) * weight;

    await this.findOneAndUpdate(
      { user: userId },
      { $set: { 'predictions.accuracy': newAccuracy } }
    );
  }
}

module.exports = new StatisticsRepository();
