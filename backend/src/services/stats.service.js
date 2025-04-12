const predictionService = require('./prediction.service');
const { AppError } = require('../middlewares/errorHandler');
const { statisticsRepository, userRepository, subscriptionRepository } = require('../repositories');
const Statistics = require('../models/statistics.model');
const InitialStats = require('../models/initial-stats.model');

class StatsService {
  constructor() {
    this.repository = statisticsRepository;
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
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

      // Verifica se l'utente ha un abbonamento attivo
      if (!user.activeSubscription) {
        throw new AppError('Non hai un abbonamento attivo', 403);
      }

      const stats = await Statistics.findOne({ user: userId });
      const isFirstSpin = !stats || stats.spinHistory.length === 0;

      if (isFirstSpin) {
        // Verifica se l'utente ha raggiunto il limite di sessioni
        const sessionCheck = await this.subscriptionRepository.checkSessionLimit(user.activeSubscription);
        if (!sessionCheck.allowed) {
          throw new AppError(`Hai raggiunto il limite di sessioni per il tuo piano (${sessionCheck.count}/${sessionCheck.limit}). Aggiorna il tuo piano per continuare.`, 403);
        }
        
        // Se non ha raggiunto il limite, incrementa il contatore
        await this.subscriptionRepository.incrementSessionCount(user.activeSubscription);
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

  async getStats(userId) {
    try {
      const stats = await this.repository.findByUserId(userId);
      if (!stats) {
        throw new AppError('Statistics not found', 404);
      }
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatsService();
