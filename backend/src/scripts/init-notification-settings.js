const mongoose = require('mongoose');
const { NotificationSettingsService } = require('../services');
require('dotenv').config();

async function initNotificationSettings() {
  try {
    // Connessione al database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connesso al database MongoDB');

    const notificationService = new NotificationSettingsService();
    
    // Inizializza le impostazioni di default
    const settings = await notificationService.initializeDefaultSettings();
    
    console.log('✅ Impostazioni di notifica inizializzate con successo:');
    console.log(`   - Email amministratore: ${settings.adminEmail}`);
    console.log(`   - Notifiche registrazione: ${settings.signupNotifications.enabled ? 'ABILITATE' : 'DISABILITATE'}`);
    console.log(`   - Notifiche richieste pagamento: ${settings.paymentRequestNotifications.enabled ? 'ABILITATE' : 'DISABILITATE'}`);
    
  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione delle impostazioni di notifica:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnesso dal database');
    process.exit(0);
  }
}

// Esegui lo script se chiamato direttamente
if (require.main === module) {
  initNotificationSettings();
}

module.exports = initNotificationSettings;
