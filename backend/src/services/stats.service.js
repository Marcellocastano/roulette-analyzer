const predictionService = require('./prediction.service');
const { AppError } = require('../middlewares/errorHandler');
const { statisticsRepository, userRepository } = require('../repositories');
const Statistics = require('../models/statistics.model');
const InitialStats = require('../models/initial-stats.model');

class StatsService {
  constructor() {
    this.repository = statisticsRepository;
    this.userRepository = userRepository;
    this.predictionService = predictionService;
  }

  async getSequences(userId, spinRange = 500) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await this.repository.getSequences(userId, spinRange);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching sequences', 500);
    }
  }

  async resetSession(userId) {
    await Statistics.deleteOne({ user: userId });
    await InitialStats.deleteMany({ userId });
    return { message: 'Sessione resettata con successo' };
  }

  async addSpin(userId, number) {
    if (number < 0 || number > 36) {
      throw new Error('Numero non valido. Deve essere tra 0 e 36');
    }
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await this.repository.updateWithNewSpin(userId, { number });
      return {
        success: true,
        message: 'Spin added successfully',
        number
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error adding spin', 500);
    }
  }

  async getSpinHistory(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await this.repository.getSpinHistory(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching spin history', 500);
    }
  }

  async deleteSpin(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await this.repository.removeLastSpin(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting spin', 500);
    }
  }

  async getPredictions(userId) {
    const stats = await Statistics.findOne({ user: userId });
    if (!stats || !stats.spinHistory || stats.spinHistory.length === 0) {
      const error = new Error('Nessuna sessione attiva trovata. Esegui prima initial-stats.');
      error.statusCode = 400;
      throw error;
    }
    return await this.predictionService.getPredictions(userId);
  }
}

module.exports = new StatsService();
