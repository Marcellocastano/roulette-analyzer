const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  generalStats: {
    totalSpins: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now },
    timeRange: {
      start: { type: Date, default: Date.now },
      end: { type: Date, default: Date.now }
    }
  },
  spinHistory: [{
    number: Number,
    timestamp: { type: Date, default: Date.now },
  }],
});

// Metodo per aggiungere un nuovo spin
statisticsSchema.methods.updateWithNewSpin = function(spin) {
  const { number } = spin;
  
  // Aggiungi lo spin alla storia
  this.spinHistory.push({
    number,
    timestamp: new Date(),
  });

  // Aggiorna le statistiche generali
  this.generalStats.totalSpins += 1;
  this.generalStats.lastUpdate = new Date();
  this.generalStats.timeRange.end = new Date();

  // Mantieni solo gli ultimi 500 spin
  if (this.spinHistory.length > 500) {
    this.spinHistory = this.spinHistory.slice(-500);
  }

  return this;
};

module.exports = mongoose.model('Statistics', statisticsSchema);
