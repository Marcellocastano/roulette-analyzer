const { AppError } = require('../middlewares/errorHandler');
const { statisticsRepository, userRepository } = require('../repositories');

class StatsService {
  async getDozensStats(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await statisticsRepository.getDozensStats(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching dozens statistics', 500);
    }
  }

  async getZeroNeighborsStats(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await statisticsRepository.getZeroNeighborsStats(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching zero neighbors statistics', 500);
    }
  }

  async getHotNumbers(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verifica l'accesso alle statistiche avanzate
      if (!user.subscription.features.advancedStats) {
        throw new AppError('Advanced statistics require premium subscription', 403);
      }

      return await statisticsRepository.getHotNumbers(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching hot numbers', 500);
    }
  }

  async getColdNumbers(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verifica l'accesso alle statistiche avanzate
      if (!user.subscription.features.advancedStats) {
        throw new AppError('Advanced statistics require premium subscription', 403);
      }

      return await statisticsRepository.getColdNumbers(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching cold numbers', 500);
    }
  }

  async getPredictions(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verifica l'accesso alle predizioni
      if (!user.subscription.features.predictions) {
        throw new AppError('Predictions require premium subscription', 403);
      }

      return await statisticsRepository.getPredictions(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching predictions', 500);
    }
  }

  async updatePredictionAccuracy(userId, spinNumber) {
    try {
      const predictions = await statisticsRepository.getPredictions(userId);
      if (!predictions || !predictions.recommendedNumbers.length) {
        return;
      }

      // Verifica se il numero era tra quelli predetti
      const wasCorrect = predictions.recommendedNumbers.some(
        pred => pred.number === spinNumber
      );

      await statisticsRepository.updatePredictionAccuracy(userId, wasCorrect);
    } catch (error) {
      // Non propaghiamo l'errore per non interrompere il flusso principale
      console.error('Error updating prediction accuracy:', error);
    }
  }
}

module.exports = new StatsService();
