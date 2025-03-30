const { AppError } = require('../middlewares/errorHandler');
const { userRepository } = require('../repositories');
const bcrypt = require('bcryptjs');
const SubscriptionService = require('./subscription.service');

class UserService {
  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async getProfile(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      // Rimuovi campi sensibili
      const { password, refreshToken, ...userProfile } = user.toObject();
      
      return userProfile;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching user profile', 500);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      // Verifica che l'utente esista
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Filtra i campi che possono essere aggiornati
      const allowedUpdates = ['name'];
      const updates = {};
      
      for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
          updates[key] = updateData[key];
        }
      }

      // Aggiorna il profilo
      const updatedUser = await userRepository.findOneAndUpdate(
        { _id: userId },
        { $set: updates }
      );

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating user profile', 500);
    }
  }

  async getSubscription(userId) {
    // Questa funzione ora delega al servizio di sottoscrizione
    return await this.subscriptionService.getUserSubscription(userId);
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      // Verifica che l'utente esista
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Carica la password attuale
      const userWithPassword = await userRepository.model.findById(userId).select('+password');
      
      // Verifica che la vecchia password sia corretta
      const isMatch = await bcrypt.compare(oldPassword, userWithPassword.password);
      if (!isMatch) {
        throw new AppError('La password attuale non è corretta', 400);
      }

      // Hash della nuova password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Aggiorna la password
      await userRepository.updatePassword(userId, hashedPassword);
      
      return { success: true, message: 'Password aggiornata con successo' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento della password', 500);
    }
  }

  async updateLastLogin(userId) {
    try {
      await userRepository.updateLastLogin(userId);
      return true;
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'ultimo accesso:', error);
      return false;
    }
  }
}

module.exports = UserService;
