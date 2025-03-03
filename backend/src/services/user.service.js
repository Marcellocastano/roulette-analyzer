const { AppError } = require('../middlewares/errorHandler');
const { userRepository } = require('../repositories');

class UserService {
  async getProfile(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        lastLogin: user.lastLogin
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching user profile', 500);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      // Rimuovi la password dai dati di aggiornamento se presente
      const safeUpdateData = { ...updateData };
      if ('password' in safeUpdateData) {
        delete safeUpdateData.password;
      }

      const updatedUser = await userRepository.findOneAndUpdate(
        { _id: userId },
        { $set: safeUpdateData },
        { new: true }
      );

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        subscription: updatedUser.subscription
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating user profile', 500);
    }
  }

  async getSubscription(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user.subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching subscription details', 500);
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Ottieni l'utente con la password (normalmente è esclusa dalle query)
      const user = await userRepository.model.findById(userId).select('+password');
      
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Verifica che la vecchia password sia corretta
      const isPasswordCorrect = await user.verifyPassword(oldPassword);
      
      if (!isPasswordCorrect) {
        throw new AppError('Password attuale non corretta', 401);
      }

      // Aggiorna la password
      user.password = newPassword;
      await user.save(); // Usa save() per attivare il middleware di hashing della password

      return {
        message: 'Password aggiornata con successo'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento della password', 500);
    }
  }

  // async subscribe(userId, plan) {
  //   try {
  //     const user = await userRepository.findById(userId);
  //     if (!user) {
  //       throw new AppError('User not found', 404);
  //     }

  //     // Verifica il piano
  //     if (!['premium'].includes(plan)) {
  //       throw new AppError('Invalid subscription plan', 400);
  //     }

  //     // Prepara i dati dell'abbonamento
  //     const subscriptionData = {
  //       plan: 'premium',
  //       startDate: new Date(),
  //       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
  //       status: 'active',
  //       features: {
  //         maxSpins: 500,
  //         predictions: true,
  //         advancedStats: true
  //       }
  //     };

  //     // Aggiorna l'abbonamento
  //     const updatedUser = await userRepository.updateSubscription(userId, subscriptionData);

  //     return updatedUser.subscription;
  //   } catch (error) {
  //     if (error instanceof AppError) throw error;
  //     throw new AppError('Error processing subscription', 500);
  //   }
  // }
}

module.exports = UserService;
