const { AppError } = require('../middlewares/errorHandler');
const { spinRepository, statisticsRepository, userRepository } = require('../repositories');

class SpinsService {
  async addSpin(userId, { number, sessionId }) {
    try {
      // Verifica i limiti dell'abbonamento
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verifica il numero di spin disponibili
      const recentSpins = await spinRepository.getRecentSpins(userId);
      if (recentSpins.length >= user.subscription.features.maxSpins) {
        throw new AppError('Spin limit reached for your subscription plan', 403);
      }

      // Crea il nuovo spin
      const spin = await spinRepository.create({
        number,
        user: userId,
        sessionId
      });

      // Aggiorna le statistiche
      await statisticsRepository.updateWithNewSpin(userId, spin);

      return spin;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error adding spin', 500);
    }
  }

  async getRecentSpins(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await spinRepository.getRecentSpins(userId, user.subscription.features.maxSpins);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching recent spins', 500);
    }
  }

  async getSpinHistory(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verifica se l'utente ha accesso alla cronologia completa
      if (user.subscription.plan !== 'premium') {
        throw new AppError('Full history access requires premium subscription', 403);
      }

      return await spinRepository.getSpinHistory(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching spin history', 500);
    }
  }

  async deleteSpin(userId, spinId) {
    try {
      const spin = await spinRepository.findById(spinId);
      
      if (!spin) {
        throw new AppError('Spin not found', 404);
      }

      if (spin.user.toString() !== userId) {
        throw new AppError('Not authorized to delete this spin', 403);
      }

      await spinRepository.deleteOne({ _id: spinId });

      // Ricalcola le statistiche
      const stats = await statisticsRepository.findOrCreateUserStats(userId);
      await stats.save();

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting spin', 500);
    }
  }

  async getSessionSpins(userId, sessionId) {
    try {
      const spins = await spinRepository.getUserSessionSpins(userId, sessionId);
      return spins;
    } catch (error) {
      throw new AppError('Error fetching session spins', 500);
    }
  }

  async getDozensStats(userId) {
    try {
      return await spinRepository.getDozensStats(userId);
    } catch (error) {
      throw new AppError('Error fetching dozens statistics', 500);
    }
  }

  async getZeroNeighborsStats(userId) {
    try {
      return await spinRepository.getZeroNeighborsStats(userId);
    } catch (error) {
      throw new AppError('Error fetching zero neighbors statistics', 500);
    }
  }
}

module.exports = new SpinsService();
