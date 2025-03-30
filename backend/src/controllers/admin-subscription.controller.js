const adminService = require('../services/admin.service');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Controller per la gestione amministrativa delle sottoscrizioni
 */
class AdminSubscriptionController {
  constructor() {
    this.adminService = adminService;
  }
  /**
   * Ottiene tutte le richieste di abbonamento in attesa
   */
  getPendingSubscriptionRequests = async (req, res, next) => {
    try {
      const requests = await this.adminService.getPendingSubscriptionRequests();
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ottiene un utente per id
   */
  getUserSubscriptionById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.adminService.getUserSubscriptionById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attiva un abbonamento in base a una richiesta
   */
  activateSubscription = async (req, res, next) => {
    try {
      const { requestId } = req.params;
      const adminId = req.user.id;

      if (!requestId) {
        return next(new AppError('ID richiesta non specificato', 400));
      }

      const subscription = await this.adminService.activateSubscriptionRequest(requestId, adminId);
      res.status(200).json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rifiuta una richiesta di abbonamento
   */
  rejectSubscriptionRequest = async (req, res, next) => {
    try {
      const { requestId } = req.params;
      const adminId = req.user.id;
      const { reason } = req.body;

      if (!requestId) {
        return next(new AppError('ID richiesta non specificato', 400));
      }

      const result = await this.adminService.rejectSubscriptionRequest(requestId, adminId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Disattiva un abbonamento attivo
   */
  deactivateSubscription = async (req, res, next) => {
    try {
      const { subscriptionId } = req.params;
      const adminId = req.user.id;
      const { reason } = req.body;

      if (!subscriptionId) {
        return next(new AppError('ID abbonamento non specificato', 400));
      }

      const result = await this.adminService.deactivateSubscription(subscriptionId, adminId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminSubscriptionController;
