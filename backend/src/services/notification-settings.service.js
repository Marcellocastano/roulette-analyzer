const { AppError } = require('../middlewares/errorHandler');
const { notificationSettingsRepository } = require('../repositories');

class NotificationSettingsService {
  /**
   * Ottiene le impostazioni di notifica correnti
   */
  async getSettings() {
    try {
      return await notificationSettingsRepository.getSettings();
    } catch (error) {
      throw new AppError('Errore durante il recupero delle impostazioni di notifica', 500);
    }
  }

  /**
   * Aggiorna le impostazioni di notifica
   */
  async updateSettings(updates) {
    try {
      // Validazione dei dati in input
      if (updates.adminEmail && !this.isValidEmail(updates.adminEmail)) {
        throw new AppError('Email amministratore non valida', 400);
      }

      return await notificationSettingsRepository.updateSettings(updates);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento delle impostazioni di notifica', 500);
    }
  }

  /**
   * Abilita/disabilita le notifiche di registrazione
   */
  async toggleSignupNotifications(enabled) {
    try {
      if (typeof enabled !== 'boolean') {
        throw new AppError('Il valore deve essere un booleano', 400);
      }

      return await notificationSettingsRepository.toggleSignupNotifications(enabled);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento delle notifiche di registrazione', 500);
    }
  }

  /**
   * Abilita/disabilita le notifiche di richiesta pagamento
   */
  async togglePaymentRequestNotifications(enabled) {
    try {
      if (typeof enabled !== 'boolean') {
        throw new AppError('Il valore deve essere un booleano', 400);
      }

      return await notificationSettingsRepository.togglePaymentRequestNotifications(enabled);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento delle notifiche di richiesta pagamento', 500);
    }
  }

  /**
   * Aggiorna l'email dell'amministratore
   */
  async updateAdminEmail(email) {
    try {
      if (!email || !this.isValidEmail(email)) {
        throw new AppError('Email non valida', 400);
      }

      return await notificationSettingsRepository.updateAdminEmail(email);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Errore durante l\'aggiornamento dell\'email amministratore', 500);
    }
  }

  /**
   * Ottiene lo stato delle notifiche
   */
  async getNotificationStatus() {
    try {
      const settings = await notificationSettingsRepository.getSettings();
      
      return {
        signupNotifications: {
          enabled: settings.signupNotifications.enabled,
          lastUpdated: settings.signupNotifications.lastUpdated
        },
        paymentRequestNotifications: {
          enabled: settings.paymentRequestNotifications.enabled,
          lastUpdated: settings.paymentRequestNotifications.lastUpdated
        },
        adminEmail: settings.adminEmail,
        lastUpdated: settings.updatedAt
      };
    } catch (error) {
      throw new AppError('Errore durante il recupero dello stato delle notifiche', 500);
    }
  }

  /**
   * Verifica se un'email è valida
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Inizializza le impostazioni di notifica con valori di default
   */
  async initializeDefaultSettings() {
    try {
      const settings = await notificationSettingsRepository.getSettings();
      console.log('Impostazioni di notifica inizializzate:', {
        adminEmail: settings.adminEmail,
        signupNotifications: settings.signupNotifications.enabled,
        paymentRequestNotifications: settings.paymentRequestNotifications.enabled
      });
      return settings;
    } catch (error) {
      console.error('Errore durante l\'inizializzazione delle impostazioni di notifica:', error);
      throw error;
    }
  }
}

module.exports = NotificationSettingsService;
