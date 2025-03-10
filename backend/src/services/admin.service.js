const { userRepository } = require('../repositories');
const { AppError } = require('../middlewares/errorHandler');
const { get } = require('lodash');

class AdminService {
  async getAllUsers() {
    try {
      // Ottieni tutti gli utenti escludendo le informazioni sensibili
      const users = await userRepository.model.find({})
        .select('-password -passwordResetToken -passwordResetExpires');
      return users;
    } catch (error) {
      throw new AppError('Errore durante il recupero degli utenti', 500);
    }
  }

  async getUserDetails(userId) {
    try {
      // Ottieni i dettagli di un utente specifico
      const user = await userRepository.findById(userId);
      
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }
      
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante il recupero dei dettagli utente', 500);
    }
  }

  async activateSubscription(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }
  
      let updateData = {};
  
      if (user.subscription.plan === 'free') {
        // Caso piano free
        updateData = {
          status: 'active',
          plan: 'premium',
          startDate: new Date(),
          endDate: user.subscription.duration === 'monthly' ?
            new Date(new Date().setMonth(new Date().getMonth() + 1)) :
            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        };
      } else if (user.subscription.plan === 'premium') {
        // Caso piano premium
        console.log(get(user, 'subscription.newRequest.status'))
        if (!user.subscription.newRequest || user.subscription.newRequest.status !== 'pending') {
          throw new AppError('Nessuna richiesta di rinnovo in sospeso', 400);
        }
  
        const currentEndDate = new Date(user.subscription.endDate);
        updateData = {
          status: 'active',
          newRequest: null,
          endDate: user.subscription.newRequest.duration === 'monthly' ?
            new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1)) :
            new Date(currentEndDate.setFullYear(currentEndDate.getFullYear() + 1))
        };
      }
      console.log(updateData)
      const updatedUser = await userRepository.updateSubscription(userId, updateData);
      return updatedUser.subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'attivazione della sottoscrizione', 500);
    }
  }

  async deactivateSubscription(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Verifica che ci sia una sottoscrizione attiva
      if (!user.subscription || user.subscription.status !== 'active') {
        throw new AppError('Nessuna sottoscrizione attiva', 400);
      }

      // Aggiorna lo stato della sottoscrizione
      const updatedUser = await userRepository.updateSubscription(userId, {
        plan: 'free',
        duration: user.subscription.duration,
        startDate: null,
        endDate: null,
        status: 'unset'
      });

      return updatedUser.subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante la revoca della sottoscrizione', 500);
    }
  }
}

module.exports = new AdminService();