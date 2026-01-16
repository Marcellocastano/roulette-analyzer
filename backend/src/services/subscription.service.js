const { AppError } = require('../middlewares/errorHandler');
const { 
  userRepository, 
  planRepository, 
  subscriptionRepository, 
  subscriptionRequestRepository 
} = require('../repositories');
const emailService = require('./email.service');

class SubscriptionService {
  async getUserSubscription(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }
      if (!user.activeSubscription) {
        return {
          active: false,
          plan: 'free'
        };
      }
      // Ottieni i dettagli dell'abbonamento
      const subscription = await subscriptionRepository.findById(user.activeSubscription);
      if (!subscription) {
        throw new AppError('Abbonamento non trovato', 404);
      }
      // Popola i dettagli del piano
      await subscription.populate('planId');

      return {
        active: subscription.isActive(),
        id: subscription._id,
        plan: subscription.planId.type,
        name: subscription.planId.name,
        duration: subscription.planId.duration,
        durationValue: subscription.planId.durationValue,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
        sessions: subscription.sessions
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante il recupero dei dettagli dell\'abbonamento', 500);
    }
  }

  /**
   * Ottiene tutte le richieste di abbonamento dell'utente
   */
  async getUserSubscriptionRequests(userId) {
    try {
      const requests = await subscriptionRequestRepository.findByUserId(userId);
      return requests;
    } catch (error) {
      throw new AppError('Errore durante il recupero delle richieste di abbonamento', 500);
    }
  }

  async requestSubscriptionInPending(userId) {
    try {
      const request = await subscriptionRequestRepository.findPendingByUserId(userId);
      if (!request) {
        return [];
      }
      return request;
    } catch (error) {
      throw new AppError('Errore durante il recupero della richiesta di abbonamento in attesa', 500);
    }
  }

  /**
   * Richiede un nuovo abbonamento o il rinnovo di un abbonamento esistente
   */
  async requestSubscription(userId, planId, type = 'new') {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Verifica se il piano esiste
      const plan = await planRepository.findById(planId);
      if (!plan) {
        throw new AppError('Piano non trovato', 404);
      }

      // Verifica se c'è già una richiesta pendente
      const pendingRequest = await subscriptionRequestRepository.findPendingByUserId(userId);
      if (pendingRequest) {
        throw new AppError('Esiste già una richiesta di abbonamento in attesa', 400);
      }

      // Determina il tipo di richiesta
      let requestType = type;
      if (user.activeSubscription) {
        const activeSubscription = await subscriptionRepository.findById(user.activeSubscription);
        if (activeSubscription && activeSubscription.isActive()) {
          // Se l'utente ha già un abbonamento attivo dello stesso tipo, è un rinnovo
          if (activeSubscription.planId.toString() === planId.toString()) {
            requestType = 'renewal';
          } else {
            // Altrimenti è un upgrade
            requestType = 'upgrade';
          }
        }
      }

      // Crea la richiesta di abbonamento
      const subscriptionRequest = await subscriptionRequestRepository.create({
        userId,
        planId,
        type: requestType,
        status: 'pending',
        requestDate: new Date(),
        paymentDetails: {
          paymentLink: plan.paymentLink,
          amount: plan.price.amount
        }
      });

      // Invia notifica di richiesta pagamento all'amministratore
      try {
        await emailService.sendPaymentRequestNotificationToAdmin(user, subscriptionRequest, plan);
      } catch (notificationError) {
        console.error('Error sending payment request notification to admin:', notificationError);
        // Non bloccare la richiesta se la notifica fallisce
      }

      return subscriptionRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante la richiesta di abbonamento', 500);
    }
  }

  /**
   * Attiva un abbonamento di prova
   */
  async activateTrial(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      if (user.isTrialUsed) {
        throw new AppError('L\'utente ha già utilizzato l\'abbonamento di prova', 400);
      }

      // Verifica se l'utente ha già un abbonamento attivo
      if (user.activeSubscription) {
        const activeSubscription = await subscriptionRepository.findById(user.activeSubscription);
        if (activeSubscription && activeSubscription.isActive()) {
          throw new AppError('L\'utente ha già un abbonamento attivo', 400);
        }
      }

      // Trova il piano trial
      const trialPlan = await planRepository.findByTypeAndDuration('trial', 'days');
      if (!trialPlan) {
        throw new AppError('Piano trial non trovato', 404);
      }

      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + (trialPlan.durationValue || 3)); // Default 3 giorni se non specificato

      // Crea l'abbonamento trial
      const subscription = await subscriptionRepository.create({
        userId,
        planId: trialPlan._id,
        status: 'active',
        startDate: now,
        endDate: endDate,
        autoRenew: false,
        sessions: {
          count: 0,
          lastReset: now
        }
      });

      // Aggiorna l'utente
      await userRepository.findOneAndUpdate(
        { _id: userId },
        { 
          $set: { 
            isTrialUsed: true,
            activeSubscription: subscription._id
          } 
        }
      );

      return subscription;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'attivazione dell\'abbonamento di prova', 500);
    }
  }

  /**
   * Annulla una richiesta di abbonamento pendente
   */
  async cancelSubscriptionRequest(userId, requestId) {
    try {
      const request = await subscriptionRequestRepository.findById(requestId);
      if (!request) {
        throw new AppError('Richiesta non trovata', 404);
      }

      if (request.userId.toString() !== userId.toString()) {
        throw new AppError('Non autorizzato', 403);
      }

      if (request.status !== 'pending') {
        throw new AppError('La richiesta non può essere annullata', 400);
      }

      await subscriptionRequestRepository.deleteOne({ _id: requestId });
      return { success: true, message: 'Request deleted' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'annullamento della richiesta', 500);
    }
  }

  /**
   * Verifica il limite di sessioni per un utente
   */
  async checkSessionLimit(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        return { allowed: false, message: 'Utente non trovato' };
      }

      // Se l'utente non ha un abbonamento attivo, usa il piano free
      if (!user.activeSubscription) {
        // Per il piano free, controlla se ci sono limiti specifici
        const freePlan = await planRepository.findByType('free');
        const sessionLimit = freePlan?.sessions?.total || 0;
        
        return { 
          allowed: sessionLimit === 0, // 0 significa nessun limite
          message: sessionLimit === 0 ? 'Accesso consentito' : 'Limite di sessioni raggiunto per il piano free'
        };
      }

      // Verifica il limite per l'abbonamento attivo
      const subscription = await subscriptionRepository.findById(user.activeSubscription);
      if (!subscription || !subscription.isActive()) {
        return { allowed: false, message: 'Abbonamento non attivo' };
      }

      return await subscriptionRepository.checkSessionLimit(subscription._id);
    } catch (error) {
      console.error('Errore durante la verifica del limite di sessioni:', error);
      return { allowed: false, message: 'Errore durante la verifica del limite' };
    }
  }

  /**
   * Incrementa il contatore delle sessioni per un utente
   */
  async incrementSessionCount(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user || !user.activeSubscription) return false;

      const subscription = await subscriptionRepository.findById(user.activeSubscription);
      if (!subscription || !subscription.isActive()) return false;

      await subscriptionRepository.incrementSessionCount(subscription._id);
      return true;
    } catch (error) {
      console.error('Errore durante l\'incremento del contatore delle sessioni:', error);
      return false;
    }
  }

  /**
   * Ottiene lo stato delle sessioni dell'utente
   * @param {string} userId - ID dell'utente
   * @returns {Promise<Object>} - Stato delle sessioni
   */
  async getSessionStatus(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }

      // Se l'utente non ha un abbonamento attivo
      if (!user.activeSubscription) {
        return {
          active: false,
          plan: 'free',
          sessions: {
            count: 0,
            limit: 0,
            unlimited: true,
            remaining: 0,
            percentage: 0
          }
        };
      }

      // Ottieni i dettagli dell'abbonamento
      const subscription = await subscriptionRepository.findById(user.activeSubscription);
      if (!subscription) {
        throw new AppError('Abbonamento non trovato', 404);
      }

      // Popola i dettagli del piano
      await subscription.populate('planId');
      
      const plan = subscription.planId;
      const sessionsCount = subscription.sessions?.count || 0;
      const sessionsLimit = plan.sessions?.total || 0;
      const unlimited = sessionsLimit === 0;
      const remaining = unlimited ? -1 : Math.max(0, sessionsLimit - sessionsCount);
      const percentage = unlimited ? 0 : Math.min(100, Math.round((sessionsCount / sessionsLimit) * 100));

      return {
        active: subscription.isActive(),
        plan: plan.type,
        planName: plan.name,
        sessions: {
          count: sessionsCount,
          limit: sessionsLimit,
          unlimited,
          remaining,
          percentage,
          lastReset: subscription.sessions?.lastReset || null,
          lastUpdated: subscription.sessions?.lastUpdated || null
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante il recupero dello stato delle sessioni', 500);
    }
  }

  /**
   * Ottiene un utente con le informazioni di abbonamento aggiornate
   */
  async getUserWithSubscription(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError('Utente non trovato', 404);
      }
      
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante il recupero delle informazioni utente', 500);
    }
  }
}

module.exports = SubscriptionService;
