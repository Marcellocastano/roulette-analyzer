/**
 * Script per verificare e aggiornare le sottoscrizioni scadute
 * Questo script può essere eseguito manualmente o tramite un job schedulato
 */
const mongoose = require('mongoose');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
const config = require('../config/config');

async function checkExpiredSubscriptions() {
  try {
    console.log('Inizio controllo sottoscrizioni scadute...');
    
    // Trova tutte le sottoscrizioni attive con data di scadenza passata
    const now = new Date();
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: now }
    });
    
    console.log(`Trovate ${expiredSubscriptions.length} sottoscrizioni scadute`);
    
    // Aggiorna lo stato di ciascuna sottoscrizione scaduta
    for (const subscription of expiredSubscriptions) {
      // Aggiorna lo stato della sottoscrizione a "expired"
      subscription.status = 'expired';
      await subscription.save();
      
      console.log(`Sottoscrizione ${subscription._id} impostata come scaduta`);
      
      // Aggiorna anche lo stato dell'utente per rimuovere l'abbonamento attivo
      await User.findByIdAndUpdate(subscription.userId, {
        $set: { activeSubscription: null }
      });
      
      console.log(`Rimosso abbonamento attivo per l'utente ${subscription.userId}`);
    }
    
    console.log('Controllo sottoscrizioni scadute completato con successo');
    return {
      success: true,
      processed: expiredSubscriptions.length
    };
  } catch (error) {
    console.error('Errore durante il controllo delle sottoscrizioni scadute:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Se lo script viene eseguito direttamente (non importato come modulo)
if (require.main === module) {
  // Connessione al database
  mongoose.connect(config.mongodb.uri)
    .then(async () => {
      console.log('Connesso a MongoDB');
      const result = await checkExpiredSubscriptions();
      console.log('Risultato:', result);
      process.exit(0);
    })
    .catch(err => {
      console.error('Errore di connessione a MongoDB:', err);
      process.exit(1);
    });
}

module.exports = checkExpiredSubscriptions;
