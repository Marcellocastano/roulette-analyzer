const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  dozens: {
    first: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    second: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    third: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    zero: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    }
  },
  zeroNeighbors: {
    total: {
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    numbers: {
      0: { count: Number, percentage: Number },
      3: { count: Number, percentage: Number },
      15: { count: Number, percentage: Number },
      26: { count: Number, percentage: Number },
      32: { count: Number, percentage: Number }
    }
  },
  hotNumbers: [{
    number: Number,
    count: Number,
    percentage: Number,
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    }
  }],
  coldNumbers: [{
    number: Number,
    lastSeen: Date,
    missedSpins: Number
  }],
  generalStats: {
    totalSpins: { type: Number, default: 0 },
    lastUpdate: Date,
    timeRange: {
      start: Date,
      end: Date
    }
  },
  predictions: {
    recommendedNumbers: [{
      number: Number,
      confidence: Number,
      reason: String
    }],
    lastCalculated: Date,
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

// Indici
statisticsSchema.index({ user: 1 }, { unique: true }); // Manteniamo questo per garantire un record per utente
statisticsSchema.index({ 'generalStats.lastUpdate': -1 }); // Per ordinare per ultimo aggiornamento

// Metodo per aggiornare le statistiche in base a un nuovo spin
statisticsSchema.methods.updateWithNewSpin = async function(spin) {
  // Aggiorna il conteggio totale
  this.generalStats.totalSpins += 1;
  this.generalStats.lastUpdate = new Date();

  // Aggiorna le statistiche delle dozzine
  const dozen = spin.metadata.dozen;
  this.dozens[dozen].count += 1;

  // Ricalcola le percentuali
  Object.keys(this.dozens).forEach(key => {
    this.dozens[key].percentage = (this.dozens[key].count / this.generalStats.totalSpins) * 100;
  });

  // Aggiorna le statistiche dei vicini dello zero
  if (spin.metadata.isZeroNeighbor) {
    this.zeroNeighbors.total.count += 1;
    this.zeroNeighbors.numbers[spin.number].count = 
      (this.zeroNeighbors.numbers[spin.number].count || 0) + 1;
  }

  // Ricalcola le percentuali dei vicini dello zero
  this.zeroNeighbors.total.percentage = 
    (this.zeroNeighbors.total.count / this.generalStats.totalSpins) * 100;

  Object.keys(this.zeroNeighbors.numbers).forEach(number => {
    if (this.zeroNeighbors.numbers[number].count) {
      this.zeroNeighbors.numbers[number].percentage = 
        (this.zeroNeighbors.numbers[number].count / this.generalStats.totalSpins) * 100;
    }
  });

  // Aggiorna numeri caldi e freddi
  await this.updateHotColdNumbers(spin);

  return this.save();
};

// Metodo per aggiornare numeri caldi e freddi
statisticsSchema.methods.updateHotColdNumbers = async function(spin) {
  // Aggiorna hot numbers
  let hotNumber = this.hotNumbers.find(n => n.number === spin.number);
  if (hotNumber) {
    hotNumber.count += 1;
    hotNumber.percentage = (hotNumber.count / this.generalStats.totalSpins) * 100;
  } else {
    this.hotNumbers.push({
      number: spin.number,
      count: 1,
      percentage: (1 / this.generalStats.totalSpins) * 100,
      trend: 'stable'
    });
  }

  // Ordina e limita hot numbers ai top 5
  this.hotNumbers.sort((a, b) => b.count - a.count);
  this.hotNumbers = this.hotNumbers.slice(0, 5);

  // Aggiorna cold numbers
  this.coldNumbers = this.coldNumbers.filter(n => n.number !== spin.number);
  
  // Aggiorna missedSpins per tutti i numeri freddi
  this.coldNumbers.forEach(n => {
    n.missedSpins += 1;
  });

  // Mantieni solo i top 5 numeri freddi
  this.coldNumbers.sort((a, b) => b.missedSpins - a.missedSpins);
  this.coldNumbers = this.coldNumbers.slice(0, 5);
};

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;
