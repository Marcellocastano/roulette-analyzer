const { NotificationSettingsService } = require('../services');
const { AppError } = require('../middlewares/errorHandler');

class NotificationSettingsController {
  constructor() {
    this.notificationSettingsService = new NotificationSettingsService();
  }

  /**
   * Ottiene le impostazioni di notifica correnti
   */
  getSettings = async (req, res, next) => {
    try {
      const settings = await this.notificationSettingsService.getSettings();
      res.status(200).json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Ottiene lo stato delle notifiche (versione semplificata)
   */
  getNotificationStatus = async (req, res, next) => {
    try {
      const status = await this.notificationSettingsService.getNotificationStatus();
      res.status(200).json({
        status: 'success',
        data: status
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Aggiorna le impostazioni di notifica
   */
  updateSettings = async (req, res, next) => {
    try {
      const updates = req.body;
      const updatedSettings = await this.notificationSettingsService.updateSettings(updates);
      
      res.status(200).json({
        status: 'success',
        message: 'Impostazioni aggiornate con successo',
        data: updatedSettings
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Abilita/disabilita le notifiche di registrazione
   */
  toggleSignupNotifications = async (req, res, next) => {
    try {
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return next(new AppError('Il campo "enabled" deve essere un booleano', 400));
      }

      const updatedSettings = await this.notificationSettingsService.toggleSignupNotifications(enabled);
      
      res.status(200).json({
        status: 'success',
        message: `Notifiche di registrazione ${enabled ? 'abilitate' : 'disabilitate'}`,
        data: updatedSettings
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Abilita/disabilita le notifiche di richiesta pagamento
   */
  togglePaymentRequestNotifications = async (req, res, next) => {
    try {
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return next(new AppError('Il campo "enabled" deve essere un booleano', 400));
      }

      const updatedSettings = await this.notificationSettingsService.togglePaymentRequestNotifications(enabled);
      
      res.status(200).json({
        status: 'success',
        message: `Notifiche di richiesta pagamento ${enabled ? 'abilitate' : 'disabilitate'}`,
        data: updatedSettings
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Aggiorna l'email dell'amministratore
   */
  updateAdminEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return next(new AppError('Email richiesta', 400));
      }

      const updatedSettings = await this.notificationSettingsService.updateAdminEmail(email);
      
      res.status(200).json({
        status: 'success',
        message: 'Email amministratore aggiornata con successo',
        data: updatedSettings
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = NotificationSettingsController;
