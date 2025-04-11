/**
 * Script per resettare i contatori delle sessioni giornaliere
 * Questo script viene eseguito ogni giorno a mezzanotte
 */
const mongoose = require('mongoose');
const User = require('../models/user.model');
const config = require('../config/config');

async function resetDailySessions() {
  try {
    console.log('Inizio reset contatori sessioni giornaliere...');
    
    const now = new Date();
    // Resetta il contatore delle sessioni giornaliere per tutti gli utenti
    const result = await User.updateMany(
      {
        "sessions.lastReset": { $lt: new Date(now.setHours(0, 0, 0, 0)) }
      },
      {
        $set: {
          "sessions.count": 0,
          "sessions.lastReset": now
        }
      }
    );
    
    console.log(`Reset completato: ${result.modifiedCount} utenti aggiornati`);
    return {
      success: true,
      message: 'Reset contatori sessioni completato con successo',
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    console.error('Errore durante il reset dei contatori sessioni:', error);
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
      const result = await resetDailySessions();
      console.log('Risultato:', result);
      process.exit(0);
    })
    .catch(err => {
      console.error('Errore di connessione a MongoDB:', err);
      process.exit(1);
    });
}

module.exports = resetDailySessions;
