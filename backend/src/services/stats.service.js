const statisticsRepository = require('../repositories/statistics.repository');
const predictionService = require('./prediction.service');
const spinsService = require('./spins.service');
const Statistics = require('../models/statistics.model');

class StatsService {
  constructor() {
    this.repository = statisticsRepository;
    this.predictionService = predictionService;
    this.spinsService = spinsService;
  }

  async addSpin(userId, number) {
    if (number < 0 || number > 36) {
      throw new Error('Numero non valido. Deve essere tra 0 e 36');
    }
    return await this.repository.updateWithNewSpin(userId, number);
  }

  async getStatistics(userId) {
    // Ottieni statistiche sia per 50 che per 500 spin
    const [stats50, stats500] = await Promise.all([
      this._getStatsForRange(userId, 50),
      this._getStatsForRange(userId, 500)
    ]);

    return {
      short_term: stats50,
      long_term: stats500
    };
  }

  async getPredictions(userId) {
    // Verifica se esiste una sessione attiva
    const stats = await Statistics.findOne({ user: userId });
    if (!stats || !stats.spinHistory || stats.spinHistory.length === 0) {
      const error = new Error('Nessuna sessione attiva trovata. Esegui prima initial-stats.');
      error.statusCode = 400;
      throw error;
    }
    return await this.predictionService.getPredictions(userId);
  }

  async resetSession(userId) {
    // Rimuove le statistiche dell'utente
    await Statistics.deleteOne({ user: userId });
    // Rimuove gli spin dell'utente
    await this.spinsService.deleteAllSpins(userId);
    return { message: 'Sessione resettata con successo' };
  }

  async _getStatsForRange(userId, spinRange) {
    const [dozens, zeroNeighbors, hotNumbers, coldNumbers, sequences] = await Promise.all([
      this.repository.getDozensStats(userId, spinRange),
      this.repository.getZeroNeighborsStats(userId, spinRange),
      this.repository.getHotNumbers(userId, 5, spinRange),
      this.repository.getColdNumbers(userId, 5, spinRange),
      this.repository.getSequences(userId, spinRange)
    ]);

    return {
      dozens,
      zeroNeighbors,
      hotNumbers,
      coldNumbers,
      sequences,
      spinRange
    };
  }

  _analyzeDozens(dozens) {
    const SUFFERING_THRESHOLD = 28; // Percentuale minima per considerare una dozzina in sofferenza
    let suffering = null;
    let minPercentage = 100;

    Object.entries(dozens).forEach(([dozen, stats]) => {
      if (dozen !== 'zero' && stats.percentage < SUFFERING_THRESHOLD && stats.percentage < minPercentage) {
        suffering = dozen;
        minPercentage = stats.percentage;
      }
    });

    return {
      suffering,
      percentage: minPercentage
    };
  }

  _analyzeZeroNeighbors(zeroNeighbors) {
    const SUFFERING_THRESHOLD = 20; // Percentuale minima per la zona zero
    const suffering = zeroNeighbors.total.percentage < SUFFERING_THRESHOLD;
    
    return {
      suffering,
      percentage: zeroNeighbors.total.percentage,
      numbers: Object.keys(zeroNeighbors.numbers).map(Number)
    };
  }

  _analyzeSequences(sequences) {
    const correlations = {};
    
    sequences.forEach(seq => {
      const { trigger, number, count } = seq;
      if (!correlations[trigger]) {
        correlations[trigger] = [];
      }
      correlations[trigger].push({ number, count });
    });

    return correlations;
  }

  _analyzeTrends(shortTermStats, longTermStats) {
    const trends = [];
    
    // Analizza trend delle dozzine
    if (shortTermStats.dozens && longTermStats.dozens) {
      for (let i = 0; i < 3; i++) {
        const shortTerm = shortTermStats.dozens[i] || 0;
        const longTerm = longTermStats.dozens[i] || 0;
        const trend = shortTerm - longTerm;
        
        if (Math.abs(trend) > 5) {
          trends.push({
            type: 'trend',
            category: 'dozen',
            dozen: i + 1,
            shortTerm,
            longTerm,
            trend,
            numbers: this._getDozenNumbers(i)
          });
        }
      }
    }

    // Analizza trend della zona zero
    if (shortTermStats.zeroNeighbors !== undefined && longTermStats.zeroNeighbors !== undefined) {
      const shortTermZero = shortTermStats.zeroNeighbors;
      const longTermZero = longTermStats.zeroNeighbors;
      const zeroTrend = shortTermZero - longTermZero;
      
      if (Math.abs(zeroTrend) > 3) {
        trends.push({
          type: 'trend',
          category: 'zeroNeighbors',
          shortTerm: shortTermZero,
          longTerm: longTermZero,
          trend: zeroTrend,
          numbers: [0, 32, 15, 19, 4, 21, 2]  // Numeri della zona zero
        });
      }
    }

    return trends;
  }

  _getDozenNumbers(dozenIndex) {
    const start = dozenIndex * 12 + 1;
    return Array.from({length: 12}, (_, i) => start + i);
  }

  _calculateConfidence(reasons) {
    return this.predictionService._calculateConfidence(reasons);
  }

  _analyzeCorrelations(stats) {
    const correlations = [];
    const knownSequences = [
      [16,32], [0,17], [35,11], [15,13], [2,4],
      [31,16,33], [19,13], [19,4,15,36,27,13],
      [27,23,25], [12,24,5,10,23], [4,2,21,20,14],
      [7,36,13], [0,32,26]
    ];

    // Analizza le sequenze note
    knownSequences.forEach(sequence => {
      const firstNumber = sequence[0];
      if (stats.hotNumbers.includes(firstNumber)) {
        correlations.push({
          type: 'sequence',
          numbers: sequence,
          probability: 85, // Alta probabilità se il primo numero è caldo
          description: `Sequenza ${sequence.join('-')} attiva`
        });
      }
    });

    // Analizza correlazioni tra numeri vicini sulla ruota
    const wheelNeighbors = {
      0: [32,15],
      32: [0,26],
      26: [32,3],
      // ... altri vicini
    };

    stats.hotNumbers.forEach(number => {
      if (wheelNeighbors[number]) {
        wheelNeighbors[number].forEach(neighbor => {
          if (stats.coldNumbers.includes(neighbor)) {
            correlations.push({
              type: 'neighbor',
              hot: number,
              cold: neighbor,
              probability: 70,
              description: `${neighbor} è freddo ma vicino al numero caldo ${number}`
            });
          }
        });
      }
    });

    return correlations;
  }
}

module.exports = new StatsService();
