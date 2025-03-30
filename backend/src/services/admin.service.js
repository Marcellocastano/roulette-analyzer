const userRepository = require('../repositories/user.repository');
const subscriptionRepository = require('../repositories/subscription.repository');
const subscriptionRequestRepository = require('../repositories/subscription-request.repository');
const planRepository = require('../repositories/plan.repository');
const { AppError } = require('../middlewares/errorHandler');
const { get } = require('lodash');

/**
 * Servizio per la gestione amministrativa
 */
class AdminService {
  async getAllUsers() {
    try {
      // Ottieni tutti gli utenti escludendo le informazioni sensibili
      const users = await userRepository.model.find({})
        .select('-password -passwordResetToken -passwordResetExpires');
      
      // Per ogni utente, aggiungi le informazioni sulla sottoscrizione
      const usersWithSubscriptions = await Promise.all(users.map(async (user) => {
        const userData = user.toObject();
        
        // Inizializza una sottoscrizione di default
        userData.subscription = {
          plan: 'free',
          duration: null,
          startDate: null,
          endDate: null,
          status: 'unset'
        };
        
        // Se l'utente ha una sottoscrizione attiva, ottieni i dettagli
        if (user.activeSubscription) {
          const subscription = await subscriptionRepository.findById(user.activeSubscription);
          if (subscription) {
            // Popola il piano per ottenere i dettagli completi
            await subscription.populate('planId');
            userData.subscription = {
              ...subscription.toObject(),
              plan: subscription.planId ? subscription.planId.type : 'unknown',
              duration: subscription.planId ? subscription.planId.duration : null
            };
          }
        }
        
        // Ottieni le richieste di sottoscrizione dell'utente
        const requests = await subscriptionRequestRepository.findByUserId(user._id);
        
        // Trova la richiesta pendente (se esiste)
        const pendingRequest = requests.find(req => req.status === 'pending');
        if (pendingRequest) {
          // Popola il piano per ottenere i dettagli completi
          await pendingRequest.populate('planId');
          userData.pendingRequest = {
            _id: pendingRequest._id,
            status: pendingRequest.status,
            type: pendingRequest.type,
            requestDate: pendingRequest.requestDate,
            plan: pendingRequest.planId ? pendingRequest.planId.type : 'unknown',
            duration: pendingRequest.planId ? pendingRequest.planId.duration : null
          };
        }
        
        // Trova la richiesta approvata (se esiste)
        const approvedRequest = requests.find(req => req.status === 'approved');
        if (approvedRequest) {
          // Popola il piano per ottenere i dettagli completi
          await approvedRequest.populate('planId');
          userData.approvedRequest = {
            _id: approvedRequest._id,
            status: approvedRequest.status,
            type: approvedRequest.type,
            requestDate: approvedRequest.requestDate,
            processedDate: approvedRequest.processedDate,
            plan: approvedRequest.planId ? approvedRequest.planId.type : 'unknown',
            duration: approvedRequest.planId ? approvedRequest.planId.duration : null,
            resultingSubscription: approvedRequest.resultingSubscription
          };
        }
        
        return userData;
      }));
      
      return usersWithSubscriptions;
    } catch (error) {
      console.error('Errore durante il recupero degli utenti:', error);
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
      
      // Aggiorniamo la subscription dell'utente
      const updatedUser = await userRepository.findOneAndUpdate(
        { _id: userId },
        { $set: { subscription: updateData } },
        { new: true }
      );
      
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
      const updatedUser = await userRepository.findOneAndUpdate(
        { _id: userId },
        { 
          $set: {
            'subscription.plan': 'free',
            'subscription.duration': user.subscription.duration,
            'subscription.startDate': null,
            'subscription.endDate': null,
            'subscription.status': 'unset'
          }
        },
        { new: true }
      );

      return updatedUser.subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante la revoca della sottoscrizione', 500);
    }
  }

  /**
   * Attiva un abbonamento in base a una richiesta
   * @param {string} requestId - ID della richiesta di abbonamento
   * @param {string} adminId - ID dell'amministratore che approva la richiesta
   * @returns {Promise<Object>} - Dettagli dell'abbonamento attivato
   */
  async activateSubscriptionRequest(requestId, adminId) {
    try {
      // Trova la richiesta di abbonamento
      const request = await subscriptionRequestRepository.findById(requestId);
      if (!request) {
        throw new AppError('Richiesta di abbonamento non trovata', 404);
      }

      // Verifica che la richiesta sia in stato pending
      if (request.status !== 'pending') {
        throw new AppError('La richiesta non è in stato pending', 400);
      }

      // Trova l'utente associato alla richiesta
      const user = await userRepository.findById(request.userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Trova il piano richiesto
      const plan = await planRepository.findById(request.planId);
      if (!plan) {
        throw new AppError('Piano non trovato', 404);
      }

      // Calcola la data di fine abbonamento
      const startDate = new Date();
      let endDate;
      
      if (plan.duration === 'monthly') {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.durationValue);
      } else if (plan.duration === 'annual') {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + plan.durationValue);
      } else if (plan.duration === 'days') {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.durationValue);
      } else {
        // Per piani con durata indefinita o non specificata
        endDate = null;
      }

      // Crea o aggiorna l'abbonamento
      const subscriptionData = {
        userId: user._id,
        planId: plan._id,
        status: 'active',
        startDate,
        endDate,
        plan: plan.type,
        duration: plan.duration,
        approvedBy: adminId,
        approvedAt: new Date()
      };

      // Se l'utente ha già un abbonamento attivo, lo aggiorna
      let subscription;
      if (user.activeSubscription) {
        subscription = await subscriptionRepository.findOneAndUpdate(
          { _id: user.activeSubscription },
          { $set: subscriptionData },
          { new: true }
        );
      } else {
        // Altrimenti crea un nuovo abbonamento
        subscription = await subscriptionRepository.create(subscriptionData);
        
        // Aggiorna l'utente con il riferimento al nuovo abbonamento
        await userRepository.findOneAndUpdate(
          { _id: user._id },
          { $set: { activeSubscription: subscription._id } },
          { new: true }
        );
      }

      // Aggiorna lo stato della richiesta
      await subscriptionRequestRepository.updateStatus(requestId, 'approved', adminId);

      return subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'attivazione dell\'abbonamento', 500);
    }
  }

  /**
   * Rifiuta una richiesta di abbonamento
   * @param {string} requestId - ID della richiesta di abbonamento
   * @param {string} adminId - ID dell'amministratore che rifiuta la richiesta
   * @param {string} reason - Motivo del rifiuto
   * @returns {Promise<Object>} - Dettagli della richiesta rifiutata
   */
  async rejectSubscriptionRequest(requestId, adminId, reason) {
    try {
      // Trova la richiesta di abbonamento
      const request = await subscriptionRequestRepository.findById(requestId);
      if (!request) {
        throw new AppError('Richiesta di abbonamento non trovata', 404);
      }

      // Verifica che la richiesta sia in stato pending
      if (request.status !== 'pending') {
        throw new AppError('La richiesta non è in stato pending', 400);
      }

      // Aggiorna lo stato della richiesta
      const updatedRequest = await subscriptionRequestRepository.findOneAndUpdate(
        { _id: requestId },
        { 
          $set: {
            status: 'rejected',
            processedBy: adminId,
            processedDate: new Date(),
            rejectionReason: reason || 'Nessun motivo specificato'
          }
        },
        { new: true }
      );

      return updatedRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante il rifiuto della richiesta di abbonamento', 500);
    }
  }

  /**
   * Disattiva un abbonamento attivo
   * @param {string} subscriptionId - ID dell'abbonamento
   * @param {string} adminId - ID dell'amministratore che disattiva l'abbonamento
   * @param {string} reason - Motivo della disattivazione
   * @returns {Promise<Object>} - Dettagli dell'abbonamento disattivato
   */
  async deactivateSubscription(subscriptionId, adminId, reason) {
    try {
      // Trova l'abbonamento
      const subscription = await subscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new AppError('Abbonamento non trovato', 404);
      }

      // Verifica che l'abbonamento sia attivo
      if (subscription.status !== 'active') {
        throw new AppError('L\'abbonamento non è attivo', 400);
      }

      // Aggiorna lo stato dell'abbonamento
      const updatedSubscription = await subscriptionRepository.findOneAndUpdate(
        { _id: subscriptionId },
        { 
          $set: {
            status: 'expired',
            deactivatedBy: adminId,
            deactivatedAt: new Date(),
            deactivationReason: reason || 'Nessun motivo specificato'
          }
        },
        { new: true }
      );

      // Trova l'utente associato all'abbonamento
      const user = await userRepository.findOne({ activeSubscription: subscriptionId });
      if (user) {
        // Aggiorna l'utente rimuovendo il riferimento all'abbonamento attivo
        await userRepository.findOneAndUpdate(
          { _id: user._id },
          { $set: { activeSubscription: null } },
          { new: true }
        );
      }

      return updatedSubscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante la disattivazione dell\'abbonamento', 500);
    }
  }
}

module.exports = new AdminService();