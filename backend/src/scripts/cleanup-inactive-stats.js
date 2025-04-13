/**
 * Script per pulire i record inattivi dalla collection InitialStats
 * Questo script viene eseguito ogni ora
 */
const mongoose = require('mongoose');
const InitialStats = require('../models/initial-stats.model');
const Statistics = require('../models/statistics.model');
const config = require('../config/config');

async function cleanupInactiveStats() {
  try {
    console.log('Inizio pulizia record inattivi da InitialStats...');
    
    // Trova ed elimina i record più vecchi di 4 ore
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const initialStatsResult = await InitialStats.deleteMany(
      { timestamp: { $lte: fourHoursAgo } }
    );

    const statisticsResult = await Statistics.deleteMany(
      { timestamp: { $lte: fourHoursAgo } }
    );
    
    console.log(`Pulizia completata: ${initialStatsResult.deletedCount} record eliminati da Initial-Stats e ${statisticsResult.deletedCount} record eliminati da Statistics`);
    return {
      success: true,
      message: 'Pulizia record inattivi completata con successo',
      deletedCount: {
        initialStats: initialStatsResult.deletedCount,
        statistics: statisticsResult.deletedCount
      }
    };
  } catch (error) {
    console.error('Errore durante la pulizia dei record inattivi:', error);
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
      const result = await cleanupInactiveStats();
      console.log('Risultato:', result);
      process.exit(0);
    })
    .catch(err => {
      console.error('Errore di connessione a MongoDB:', err);
      process.exit(1);
    });
}

module.exports = cleanupInactiveStats;
