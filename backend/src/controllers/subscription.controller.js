const { SubscriptionService } = require('../services');
const { AppError } = require('../middlewares/errorHandler');
const { AuthService } = require('../services');

/**
 * Controller per la gestione delle sottoscrizioni
 */
class SubscriptionController {
  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  /**
   * Ottiene i dettagli dell'abbonamento attivo dell'utente
   */
  getUserSubscription = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const subscription = await this.subscriptionService.getUserSubscription(userId);
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ottiene tutte le richieste di abbonamento dell'utente
   */
  getUserSubscriptionRequests = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const requests = await this.subscriptionService.getUserSubscriptionRequests(userId);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Richiede un nuovo abbonamento o il rinnovo di un abbonamento esistente
   */
  requestSubscription = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { planId, type } = req.body;

      if (!planId) {
        return next(new AppError('Piano non specificato', 400));
      }

      const request = await this.subscriptionService.requestSubscription(userId, planId, type);
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  requestSubscriptionInPending = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const request = await this.subscriptionService.requestSubscriptionInPending(userId);
      res.status(200).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attiva un abbonamento di prova
   */
  activateTrial = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const subscription = await this.subscriptionService.activateTrial(userId);
      
      // Ottieni l'utente aggiornato dal database
      const authService = new AuthService();
      
      // Trova l'utente aggiornato con l'abbonamento attivo
      const updatedUser = await this.subscriptionService.getUserWithSubscription(userId);
      
      // Genera un nuovo token con le informazioni aggiornate
      const accessToken = authService.generateAccessToken(updatedUser);
      
      res.status(200).json({ 
        success: true, 
        data: subscription,
        accessToken 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Annulla una richiesta di abbonamento pendente
   */
  cancelSubscriptionRequest = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { requestId } = req.params;

      if (!requestId) {
        return next(new AppError('ID richiesta non specificato', 400));
      }

      const result = await this.subscriptionService.cancelSubscriptionRequest(userId, requestId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifica il limite di sessioni per un utente
   */
  checkSessionLimit = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await this.subscriptionService.checkSessionLimit(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Incrementa il contatore delle sessioni per un utente
   */
  incrementSessionCount = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await this.subscriptionService.incrementSessionCount(userId);
      res.status(200).json({ success: true, data: { updated: result } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ottiene la cronologia delle richieste di abbonamento dell'utente
   */
  getSubscriptionHistory = async (req, res, next) => {
    try {
      const history = await this.subscriptionService.getSubscriptionHistory(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ottiene lo stato delle sessioni dell'utente
   */
  getSessionStatus = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const sessionStatus = await this.subscriptionService.getSessionStatus(userId);
      res.status(200).json({ success: true, data: sessionStatus });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubscriptionController;
