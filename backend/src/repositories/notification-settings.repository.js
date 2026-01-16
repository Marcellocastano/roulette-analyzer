const { NotificationSettings } = require('../models');

class NotificationSettingsRepository {
  /**
   * Ottiene le impostazioni di notifica (singleton)
   */
  async getSettings() {
    return await NotificationSettings.getSettings();
  }

  /**
   * Aggiorna le impostazioni di notifica
   */
  async updateSettings(updates) {
    return await NotificationSettings.updateSettings(updates);
  }

  /**
   * Verifica se le notifiche di registrazione sono abilitate
   */
  async isSignupNotificationEnabled() {
    const settings = await this.getSettings();
    return settings.signupNotifications.enabled;
  }

  /**
   * Verifica se le notifiche di richiesta pagamento sono abilitate
   */
  async isPaymentRequestNotificationEnabled() {
    const settings = await this.getSettings();
    return settings.paymentRequestNotifications.enabled;
  }

  /**
   * Ottiene l'email dell'amministratore
   */
  async getAdminEmail() {
    const settings = await this.getSettings();
    return settings.adminEmail;
  }

  /**
   * Abilita/disabilita le notifiche di registrazione
   */
  async toggleSignupNotifications(enabled) {
    return await this.updateSettings({
      signupNotifications: {
        enabled,
        lastUpdated: new Date()
      }
    });
  }

  /**
   * Abilita/disabilita le notifiche di richiesta pagamento
   */
  async togglePaymentRequestNotifications(enabled) {
    return await this.updateSettings({
      paymentRequestNotifications: {
        enabled,
        lastUpdated: new Date()
      }
    });
  }

  /**
   * Verifica se le notifiche di contatto sono abilitate
   */
  async isContactNotificationEnabled() {
    const settings = await this.getSettings();
    return settings.contactNotifications?.enabled ?? true;
  }

  /**
   * Abilita/disabilita le notifiche di contatto
   */
  async toggleContactNotifications(enabled) {
    return await this.updateSettings({
      contactNotifications: {
        enabled,
        lastUpdated: new Date()
      }
    });
  }

  /**
   * Aggiorna l'email dell'amministratore
   */
  async updateAdminEmail(email) {
    return await this.updateSettings({
      adminEmail: email
    });
  }
}

module.exports = NotificationSettingsRepository;
