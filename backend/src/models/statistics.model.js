const mongoose = require('mongoose');

const ZERO_NEIGHBORS = [0, 3, 15, 26, 32, 35, 12];

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
    timestamp: { type: Date, default: Date.now }
  }],
  stats50: {
    dozens: {
      first: {  // 1-12
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      second: {  // 13-24
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      third: {  // 25-36
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
        type: Object,
        default: () => {
          const numbers = {};
          ZERO_NEIGHBORS.forEach(num => {
            numbers[num] = { count: 0, percentage: 0 };
          });
          return numbers;
        }
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
      count: Number,
      percentage: Number,
      lastSeen: Date
    }],
    sequences: [{
      trigger: Number,
      followers: [Number],
      occurrences: Number,
      successRate: Number
    }]
  },
  stats500: {
    dozens: {
      first: {  // 1-12
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      second: {  // 13-24
        count: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      },
      third: {  // 25-36
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
        type: Object,
        default: () => {
          const numbers = {};
          ZERO_NEIGHBORS.forEach(num => {
            numbers[num] = { count: 0, percentage: 0 };
          });
          return numbers;
        }
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
      count: Number,
      percentage: Number,
      lastSeen: Date
    }],
    sequences: [{
      trigger: Number,
      followers: [Number],
      occurrences: Number,
      successRate: Number
    }]
  }
});

statisticsSchema.methods.updateWithNewSpin = function(spin) {
  // Aggiorna le statistiche generali
  this.generalStats.totalSpins++;
  this.generalStats.lastUpdate = new Date();
  this.generalStats.timeRange.end = new Date();

  // Aggiungi lo spin alla storia
  this.spinHistory.push({
    number: spin,
    timestamp: new Date()
  });

  // Mantieni solo gli ultimi 500 spin
  if (this.spinHistory.length > 500) {
    this.spinHistory = this.spinHistory.slice(-500);
  }

  // Calcola le statistiche per i diversi intervalli
  const last50Spins = this.spinHistory.slice(-50);
  const last500Spins = this.spinHistory;

  // Resetta le statistiche
  this._resetStats('stats50');
  this._resetStats('stats500');

  // Aggiorna le statistiche per ogni intervallo
  last50Spins.forEach(spin => {
    this._updateStatsForRange('stats50', spin.number);
  });

  last500Spins.forEach(spin => {
    this._updateStatsForRange('stats500', spin.number);
  });

  return this;
};

statisticsSchema.methods._resetStats = function(statsKey) {
  // Resetta le dozzine
  Object.keys(this[statsKey].dozens).forEach(dozen => {
    this[statsKey].dozens[dozen].count = 0;
    this[statsKey].dozens[dozen].percentage = 0;
  });

  // Resetta i vicini dello zero
  this[statsKey].zeroNeighbors.total.count = 0;
  this[statsKey].zeroNeighbors.total.percentage = 0;
  Object.keys(this[statsKey].zeroNeighbors.numbers).forEach(num => {
    this[statsKey].zeroNeighbors.numbers[num].count = 0;
    this[statsKey].zeroNeighbors.numbers[num].percentage = 0;
  });

  // Resetta numeri caldi e freddi
  this[statsKey].hotNumbers = [];
  this[statsKey].coldNumbers = [];

  // Resetta sequenze
  this[statsKey].sequences = [];
};

statisticsSchema.methods._updateStatsForRange = function(statsKey, spin) {
  const totalSpins = statsKey === 'stats50' ? 
    Math.min(this.spinHistory.length, 50) : 
    this.spinHistory.length;

  this._updateDozens(statsKey, spin, totalSpins);
  this._updateZeroNeighbors(statsKey, spin, totalSpins);
  this._updateHotColdNumbers(statsKey, spin, totalSpins);
  this._updateSequences(statsKey, spin);
};

statisticsSchema.methods._updateDozens = function(statsKey, spin, totalSpins) {
  let dozen;
  if (spin === 0) {
    dozen = 'zero';
  } else if (spin <= 12) {
    dozen = 'first';
  } else if (spin <= 24) {
    dozen = 'second';
  } else {
    dozen = 'third';
  }

  this[statsKey].dozens[dozen].count++;
  
  // Aggiorna le percentuali per tutte le dozzine
  Object.keys(this[statsKey].dozens).forEach(d => {
    this[statsKey].dozens[d].percentage = 
      (this[statsKey].dozens[d].count / totalSpins) * 100;
  });
};

statisticsSchema.methods._updateZeroNeighbors = function(statsKey, spin, totalSpins) {
  if (ZERO_NEIGHBORS.includes(spin)) {
    this[statsKey].zeroNeighbors.total.count++;
    
    // Aggiorna il conteggio specifico del numero
    this[statsKey].zeroNeighbors.numbers[spin].count++;
  }
  
  // Aggiorna le percentuali
  this[statsKey].zeroNeighbors.total.percentage = 
    (this[statsKey].zeroNeighbors.total.count / totalSpins) * 100;

  Object.keys(this[statsKey].zeroNeighbors.numbers).forEach(num => {
    this[statsKey].zeroNeighbors.numbers[num].percentage = 
      (this[statsKey].zeroNeighbors.numbers[num].count / totalSpins) * 100;
  });
};

statisticsSchema.methods._updateHotColdNumbers = function(statsKey, spin, totalSpins) {
  // Inizializza un contatore per tutti i numeri
  const numberCounts = new Array(37).fill(0);
  
  // Conta le occorrenze di ogni numero nell'intervallo specificato
  const spins = statsKey === 'stats50' ? 
    this.spinHistory.slice(-50) : 
    this.spinHistory;

  spins.forEach(s => {
    numberCounts[s.number]++;
  });

  // Identifica numeri caldi (top 5 per frequenza)
  const hotNumbers = numberCounts
    .map((count, number) => ({ number, count }))
    .filter(n => n.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(n => ({
      number: n.number,
      count: n.count,
      percentage: (n.count / totalSpins) * 100,
      trend: this._calculateTrend(statsKey, n.number, n.count, totalSpins)
    }));

  // Identifica numeri freddi (numeri che non sono usciti)
  const coldNumbers = numberCounts
    .map((count, number) => ({ number, count }))
    .filter(n => n.count === 0)
    .slice(0, 5)
    .map(n => ({
      number: n.number,
      count: 0,
      percentage: 0,
      lastSeen: this._getLastSeen(n.number)
    }));

  this[statsKey].hotNumbers = hotNumbers;
  this[statsKey].coldNumbers = coldNumbers;
};

statisticsSchema.methods._calculateTrend = function(statsKey, number, currentCount, totalSpins) {
  const currentPercentage = (currentCount / totalSpins) * 100;
  
  // Per stats50, confronta con stats500
  if (statsKey === 'stats50' && this.stats500.hotNumbers.length > 0) {
    const long_term = this.stats500.hotNumbers.find(n => n.number === number);
    if (long_term) {
      const ratio = currentPercentage / long_term.percentage;
      if (ratio > 1.2) return 'increasing';
      if (ratio < 0.8) return 'decreasing';
    }
  }
  
  return 'stable';
};

statisticsSchema.methods._getLastSeen = function(number) {
  for (let i = this.spinHistory.length - 1; i >= 0; i--) {
    if (this.spinHistory[i].number === number) {
      return this.spinHistory[i].timestamp;
    }
  }
  return null;
};

statisticsSchema.methods._updateSequences = function(statsKey, spin) {
  const spins = statsKey === 'stats50' ? 
    this.spinHistory.slice(-50) : 
    this.spinHistory;

  // Sequenze note
  const KNOWN_SEQUENCES = {
    16: [32],
    0: [17],
    35: [11],
    15: [13],
    2: [4],
    31: [16, 33],
    19: [13],
    19: [4, 15, 36, 27, 13],
    27: [23, 25],
    12: [24, 5, 10, 23],
    4: [2, 21, 20, 14],
    7: [36, 13],
    0: [32, 26]
  };

  // Analizza le sequenze
  const sequences = new Map();
  
  for (let i = 0; i < spins.length - 1; i++) {
    const trigger = spins[i].number;
    const follower = spins[i + 1].number;
    
    if (KNOWN_SEQUENCES[trigger]) {
      // Gestisci sia sequenze singole che multiple
      const knownFollowers = Array.isArray(KNOWN_SEQUENCES[trigger][0]) ? 
        KNOWN_SEQUENCES[trigger] : 
        [KNOWN_SEQUENCES[trigger]];
        
      knownFollowers.forEach(followers => {
        const key = `${trigger}-${followers.join(',')}`;
        if (!sequences.has(key)) {
          sequences.set(key, {
            trigger,
            followers,
            occurrences: 1,
            successes: followers.includes(follower) ? 1 : 0
          });
        } else {
          const seq = sequences.get(key);
          seq.occurrences++;
          if (followers.includes(follower)) {
            seq.successes++;
          }
        }
      });
    }
  }

  // Converti le sequenze in array e calcola il tasso di successo
  this[statsKey].sequences = Array.from(sequences.values())
    .map(seq => ({
      trigger: seq.trigger,
      followers: seq.followers,
      occurrences: seq.occurrences,
      successRate: (seq.successes / seq.occurrences) * 100
    }))
    .sort((a, b) => b.successRate - a.successRate);
};

module.exports = mongoose.model('Statistics', statisticsSchema);
