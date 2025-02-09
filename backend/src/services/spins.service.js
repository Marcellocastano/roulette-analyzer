const { AppError } = require('../middlewares/errorHandler');
const { spinRepository, statisticsRepository, userRepository } = require('../repositories');

const ZERO_NEIGHBORS = [0, 3, 15, 26, 32, 35, 12];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

class SpinsService {
  async addSpin(userId, { number, sessionId }) {
    try {
      // Verifica i limiti dell'abbonamento
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calcola i metadati
      const metadata = this._calculateSpinMetadata(number);

      // Crea il nuovo spin
      const spin = await spinRepository.create({
        number,
        user: userId,
        sessionId,
        metadata
      });
      await statisticsRepository.updateWithNewSpin(userId, {
        number,
        foreignSpinId: spin._id
      });
      return spin;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error adding spin', 500);
    }
  }

  _calculateSpinMetadata(number) {
    // Determina la dozzina
    let dozen;
    if (number === 0) {
      dozen = 'zero';
    } else if (number <= 12) {
      dozen = 'first';
    } else if (number <= 24) {
      dozen = 'second';
    } else {
      dozen = 'third';
    }

    // Determina se è un vicino dello zero
    const isZeroNeighbor = ZERO_NEIGHBORS.includes(number);

    // Determina il colore
    let color;
    if (number === 0) {
      color = 'green';
    } else if (RED_NUMBERS.includes(number)) {
      color = 'red';
    } else {
      color = 'black';
    }

    // Determina se è pari
    const isEven = number !== 0 && number % 2 === 0;

    return {
      dozen,
      isZeroNeighbor,
      color,
      isEven
    };
  }

  async getRecentSpins(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return await spinRepository.getRecentSpins(userId);
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
      // if (user.subscription.plan !== 'premium') {
      //   throw new AppError('Full history access requires premium subscription', 403);
      // }

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

      await statisticsRepository.removeSpinFromHistory(userId, spinId);

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

  async getSpins(userId) {
    return await spinRepository.find({ user: userId });
  }

  async deleteAllSpins(userId) {
    return await spinRepository.deleteMany({ user: userId });
  }
}

module.exports = new SpinsService();
