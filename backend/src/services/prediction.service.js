const statisticsRepository = require('../repositories/statistics.repository');

// Disposizione dei numeri sulla ruota della roulette europea
const ROULETTE_WHEEL = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Mappa per ottenere rapidamente l'indice di un numero sulla ruota
const NUMBER_TO_INDEX = ROULETTE_WHEEL.reduce((map, num, index) => {
  map[num] = index;
  return map;
}, {});

// Sequenze note della roulette
const KNOWN_SEQUENCES = {
  0: [17, 32, 6, 34, 24, 16], 
  16: [32, 33],
  17: [0],
  35: [11],
  15: [13],
  2: [4],
  31: [16, 33],
  19: [13, 4, 15, 36, 27, 13],
  27: [23, 25],
  12: [24, 5, 10, 23],
  4: [2, 21, 20, 14],
  7: [36, 13],
  32: [26]
};

// Numeri della zona zero
const ZERO_NEIGHBORS = [0, 3, 15, 26, 32, 35, 12];

class PredictionService {
  constructor() {
    this.repository = statisticsRepository;
    this.MAX_RECOMMENDED_NUMBERS = 15;
  }

  async _getStats(userId) {
    const stats = await this.repository.findOrCreateUserStats(userId);
    if (!stats) {
      throw new Error('Nessuna statistica trovata');
    }

    console.log('\nStatistiche ricevute:');
    console.log('50 spin:', JSON.stringify(stats.stats50, null, 2));
    console.log('500 spin:', JSON.stringify(stats.stats500, null, 2));

    // Assicurati che le strutture dati esistano
    stats.stats50 = stats.stats50 || {};
    stats.stats500 = stats.stats500 || {};
    stats.stats50.numbers = stats.stats50.numbers || {};
    stats.stats500.numbers = stats.stats500.numbers || {};
    stats.stats50.dozens = stats.stats50.dozens || { first: { count: 0, percentage: 0 }, second: { count: 0, percentage: 0 }, third: { count: 0, percentage: 0 }, zero: { count: 0, percentage: 0 } };
    stats.stats500.dozens = stats.stats500.dozens || { first: { count: 0, percentage: 0 }, second: { count: 0, percentage: 0 }, third: { count: 0, percentage: 0 }, zero: { count: 0, percentage: 0 } };
    stats.stats50.zeroNeighbors = stats.stats50.zeroNeighbors || { total: { count: 0, percentage: 0 }, numbers: {} };
    stats.stats500.zeroNeighbors = stats.stats500.zeroNeighbors || { total: { count: 0, percentage: 0 }, numbers: {} };
    stats.spinHistory = stats.spinHistory || [];

    return stats;
  }

  _getHotAndIncreasingNumbers(stats) {
    const result = {
      hot: new Set(),
      increasing: new Set(),
      inSofferentDozen: new Set()
    };

    // Mappa per tenere traccia delle percentuali
    const percentages = {
      short: {}, // percentuali a 50 spin
      long: {}   // percentuali a 500 spin
    };

    // Raccogli le percentuali dai numeri caldi
    if (stats.stats50.hotNumbers) {
      stats.stats50.hotNumbers.forEach(hot => {
        percentages.short[hot.number] = hot.percentage;
        if (hot.percentage > 0) {
          result.hot.add(hot.number);
        }
      });
    }
    if (stats.stats500.hotNumbers) {
      stats.stats500.hotNumbers.forEach(hot => {
        percentages.long[hot.number] = hot.percentage;
      });
    }

    // Raccogli le percentuali dai numeri freddi
    if (stats.stats50.coldNumbers) {
      stats.stats50.coldNumbers.forEach(cold => {
        if (!percentages.short[cold.number]) {
          percentages.short[cold.number] = cold.percentage;
        }
      });
    }
    if (stats.stats500.coldNumbers) {
      stats.stats500.coldNumbers.forEach(cold => {
        if (!percentages.long[cold.number]) {
          percentages.long[cold.number] = cold.percentage;
        }
      });
    }

    // Calcola i numeri in crescita
    for (let i = 0; i <= 36; i++) {
      const short = percentages.short[i] || 0;
      const long = percentages.long[i] || 0;
      
      // Un numero è in crescita se la sua percentuale a 50 spin
      // è maggiore della percentuale a 500 spin
      if (short > long) {
        result.increasing.add(i);
        console.log(`Numero ${i} in crescita: ${short}% vs ${long}%`);
      }
    }

    // Calcola la dozzina sofferente
    let sofferentDozen = null;
    let minPercentage = 100;
    const dozens = stats.stats500.dozens;
    
    Object.entries(dozens).forEach(([dozen, data]) => {
      if (dozen === 'zero') return;
      if (data.percentage < minPercentage) {
        minPercentage = data.percentage;
        sofferentDozen = dozen;
      }
    });

    // Aggiungi numeri della dozzina sofferente
    if (sofferentDozen) {
      const start = sofferentDozen === 'first' ? 1 : sofferentDozen === 'second' ? 13 : 25;
      const end = start + 11;
      for (let i = start; i <= end; i++) {
        result.inSofferentDozen.add(i);
      }
    }

    return result;
  }

  _analyzeSequences(lastNumber, sofferentDozen, stats, numbers) {
    const sequences = KNOWN_SEQUENCES[lastNumber];
    if (!sequences) {
      console.log(`  Nessuna sequenza nota per ${lastNumber}`);
      return null;
    }

    console.log(`  Sequenze note per ${lastNumber}: ${sequences.join(', ')}`);
    console.log(`  Dozzina sofferente: ${sofferentDozen}`);
    
    const result = {
      primary: [],
      secondary: []
    };

    sequences.forEach(num => {
      console.log(`\nAnalisi numero ${num}:`);
      
      const isHot = numbers.hot.has(num);
      const isIncreasing = numbers.increasing.has(num);
      const isInSofferentDozen = numbers.inSofferentDozen.has(num);
      
      console.log(`  Hot: ${isHot}`);
      console.log(`  In crescita: ${isIncreasing}`);
      console.log(`  In dozzina sofferente: ${isInSofferentDozen}`);

      // Un numero è primary se:
      // 1. È in crescita, OPPURE
      // 2. È nella dozzina sofferente
      if (isIncreasing || isInSofferentDozen) {
        result.primary.push(num);
        const reasons = [];
        if (isIncreasing) reasons.push('in crescita');
        if (isInSofferentDozen) reasons.push('dozzina sofferente');
        if (isHot) reasons.push('caldo');
        console.log(`  * Aggiunto ai primary (${reasons.join(', ')})`);
      } else {
        result.secondary.push(num);
        console.log(`  * Aggiunto ai secondary`);
      }
    });

    return {
      type: 'sequence',
      trigger: lastNumber,
      numbers: result
    };
  }

  async getPredictions(userId) {
    try {
      const stats = await this._getStats(userId);
      
      if (!stats.spinHistory || stats.spinHistory.length === 0) {
        throw new Error('Nessuna sessione attiva trovata. Esegui prima initial-stats.');
      }

      console.log('\n=== INIZIO ANALISI PREDIZIONI ===\n');
      console.log(`Numero di spin: ${stats.spinHistory.length}`);

      // Analisi delle dozzine
      console.log('\n1. ANALISI DOZZINE:');
      const dozenAnalysis = this._analyzeDozens(stats);

      // Analisi della zona zero
      console.log('\n2. ANALISI ZONA ZERO:');
      const zeroAnalysis = this._analyzeZeroNeighbors(stats);

      // Analisi delle sequenze
      console.log('\n3. ANALISI SEQUENZE:');
      const lastSpin = stats.spinHistory[stats.spinHistory.length - 1].number;
      console.log(`- Ultimo numero uscito: ${lastSpin}`);
      
      // Ottieni numeri caldi e in crescita
      const numbers = this._getHotAndIncreasingNumbers(stats);
      console.log('\nAnalisi numeri:');
      console.log(`  Hot: ${Array.from(numbers.hot).join(', ')}`);
      console.log(`  In crescita: ${Array.from(numbers.increasing).join(', ')}`);
      console.log(`  Dozzina sofferente: ${Array.from(numbers.inSofferentDozen).join(', ')}`);

      const sequenceAnalysis = this._analyzeSequences(lastSpin, dozenAnalysis?.dozen, stats, numbers);

      // Raccogli tutti i numeri raccomandati
      const recommendedNumbers = {
        primary: new Set(),
        secondary: new Set()
      };

      // Aggiungi i numeri dalle sequenze
      if (sequenceAnalysis) {
        sequenceAnalysis.numbers.primary.forEach(n => recommendedNumbers.primary.add(n));
        sequenceAnalysis.numbers.secondary.forEach(n => recommendedNumbers.secondary.add(n));
      }

      // Aggiungi tutti i numeri in crescita ai primary
      numbers.increasing.forEach(n => recommendedNumbers.primary.add(n));

      // Converti i Set in array e limita il numero di numeri
      const result = {
        recommendedNumbers: {
          primary: Array.from(recommendedNumbers.primary).slice(0, 3),
          secondary: Array.from(recommendedNumbers.secondary).slice(0, 4)
        },
        reasons: [],
        confidence: 0
      };

      // Aggiungi le ragioni
      if (dozenAnalysis) result.reasons.push(dozenAnalysis);
      if (zeroAnalysis) result.reasons.push(zeroAnalysis);
      if (sequenceAnalysis) result.reasons.push(sequenceAnalysis);

      // Calcola la confidenza
      let confidence = 0;
      
      // Contributo delle dozzine
      if (dozenAnalysis) {
        const dozenContribution = Math.min(300, (30 - dozenAnalysis.percentage) * 10);
        confidence += dozenContribution;
        console.log(`- Dozzina ${dozenAnalysis.dozen}: +${dozenContribution} (${dozenAnalysis.percentage}%)`);
      }

      // Contributo della zona zero
      if (zeroAnalysis) {
        const zeroContribution = Math.min(200, (20 - zeroAnalysis.percentage) * 10);
        confidence += zeroContribution;
        console.log(`- Zona zero: +${zeroContribution} (${zeroAnalysis.percentage}%)`);
      }

      // Contributo delle sequenze
      if (sequenceAnalysis) {
        confidence += 20;
        console.log('- Sequenza valida: +20');
      }

      // Normalizza la confidenza a 100
      result.confidence = Math.min(100, confidence);

      console.log(`\nConfidenza finale: ${result.confidence}%`);
      
      return result;

    } catch (error) {
      console.error('Errore nel calcolo delle predizioni:', error);
      throw error;
    }
  }

  _analyzeDozens(stats) {
    const DOZEN_THRESHOLD = 28; // percentuale minima per considerare una dozzina in sofferenza
    
    // Verifica che la struttura delle dozzine esista
    if (!stats.stats500.dozens) {
      console.log('  Errore: struttura dozzine non valida');
      return null;
    }

    console.log('\nStruttura dozzine:', JSON.stringify(stats.stats500.dozens, null, 2));

    const dozens = stats.stats500.dozens;
    let sofferentDozen = null;
    let minPercentage = 100;

    // Mappa per convertire da nome a numero dozzina
    const dozenMap = {
      'first': 1,
      'second': 2,
      'third': 3
    };

    console.log('  Percentuali dozzine a 500 spin:');
    Object.entries(dozens).forEach(([dozen, data]) => {
      if (dozen === 'zero') return; // Ignora lo zero

      const percentage = data.percentage;
      const dozenNumber = dozenMap[dozen];
      console.log(`  - Dozzina ${dozenNumber}: ${percentage}% (${data.count} uscite)`);
      
      if (percentage < DOZEN_THRESHOLD && (sofferentDozen === null || percentage < minPercentage)) {
        minPercentage = percentage;
        sofferentDozen = dozenNumber;
      }
    });

    if (sofferentDozen) {
      console.log(`  * Trovata dozzina ${sofferentDozen} in sofferenza (${minPercentage}%)`);
      return {
        type: 'dozen',
        dozen: sofferentDozen,
        percentage: minPercentage
      };
    }

    console.log('  * Nessuna dozzina in sofferenza trovata');
    return null;
  }

  _analyzeZeroNeighbors(stats) {
    const ZERO_THRESHOLD = 20; // percentuale minima per considerare la zona zero in sofferenza
    
    // Verifica che la struttura della zona zero esista
    if (!stats.stats500.zeroNeighbors) {
      console.log('  Errore: struttura zona zero non valida');
      return null;
    }

    console.log('\nStruttura zona zero:', JSON.stringify(stats.stats500.zeroNeighbors, null, 2));

    // La percentuale è nell'oggetto total
    const percentage = stats.stats500.zeroNeighbors.total?.percentage || 0;
    const count = stats.stats500.zeroNeighbors.total?.count || 0;
    console.log(`  Percentuale zona zero a 500 spin: ${percentage}% (${count} uscite)`);

    if (percentage < ZERO_THRESHOLD) {
      const numbers = {
        increasing: [],
        stable: [],
        decreasing: []
      };

      // Analizza il trend di ogni numero della zona zero
      ZERO_NEIGHBORS.forEach(num => {
        const trend = this._calculateTrend(stats, num);
        numbers[trend].push(num);
      });

      return {
        type: 'zero',
        percentage,
        numbers
      };
    }

    return null;
  }

  _calculateTrend(stats, number) {
    // Verifica che le strutture dati esistano
    if (!stats || !stats.stats50 || !stats.stats500 || 
        !stats.stats50.numbers || !stats.stats500.numbers) {
      console.log(`    Errore: struttura statistiche non valida`);
      return 'stable';
    }

    // Le statistiche contengono oggetti con count e percentage
    const shortTerm = stats.stats50.numbers[number];
    const longTerm = stats.stats500.numbers[number];

    // Se il numero non è mai uscito, è stabile
    if (!shortTerm && !longTerm) {
      console.log(`    ${number}: mai uscito`);
      return 'stable';
    }
    
    // Usa le percentuali
    const shortTermPercentage = shortTerm?.percentage || 0;
    const longTermPercentage = longTerm?.percentage || 0;
    const shortTermCount = shortTerm?.count || 0;
    const longTermCount = longTerm?.count || 0;

    console.log(`    ${number}: corto=${shortTermPercentage}% (${shortTermCount}), lungo=${longTermPercentage}% (${longTermCount})`);

    // Se il numero non è mai uscito nel breve periodo ma è uscito nel lungo, è in diminuzione
    if ((!shortTerm || shortTermCount === 0) && longTermCount > 0) return 'decreasing';
    
    // Se il numero è uscito nel breve periodo ma non nel lungo, è in crescita
    if (shortTermCount > 0 && (!longTerm || longTermCount === 0)) return 'increasing';

    // Altrimenti confronta le percentuali
    if (shortTermPercentage > longTermPercentage + 5) return 'increasing';
    if (shortTermPercentage < longTermPercentage - 5) return 'decreasing';
    return 'stable';
  }

  _getDozenNumbers(dozen) {
    const start = (dozen - 1) * 12 + 1;
    return Array.from({ length: 12 }, (_, i) => start + i);
  }

  _limitRecommendations(primary, secondary) {
    // Ordina i numeri per posizione sulla ruota
    primary.sort((a, b) => NUMBER_TO_INDEX[a] - NUMBER_TO_INDEX[b]);
    secondary.sort((a, b) => NUMBER_TO_INDEX[a] - NUMBER_TO_INDEX[b]);

    console.log('\n  Prima della limitazione:');
    console.log(`  - Primary: ${primary.length} numeri`);
    console.log(`  - Secondary: ${secondary.length} numeri`);

    // Se abbiamo troppi numeri in totale
    if (primary.length + secondary.length > this.MAX_RECOMMENDED_NUMBERS) {
      // Mantieni tutti i primary possibili
      if (primary.length <= this.MAX_RECOMMENDED_NUMBERS) {
        // Prendi tutti i primary e riempi il resto con secondary
        const remainingSpace = this.MAX_RECOMMENDED_NUMBERS - primary.length;
        secondary = secondary.slice(0, remainingSpace);
        console.log(`  * Mantenuti tutti i primary e ridotti i secondary a ${remainingSpace}`);
      } else {
        // Se ci sono troppi primary, prendi solo i primi MAX_RECOMMENDED_NUMBERS
        primary = primary.slice(0, this.MAX_RECOMMENDED_NUMBERS);
        secondary = [];
        console.log(`  * Troppi primary, ridotti a ${this.MAX_RECOMMENDED_NUMBERS}`);
      }
    }

    return {
      primary,
      secondary
    };
  }

  _calculateConfidence(reasons) {
    let confidence = 0;
    console.log('\n7. CALCOLO CONFIDENZA:');

    reasons.forEach(reason => {
      switch (reason.type) {
        case 'dozen':
          // Più bassa è la percentuale, più alta è la confidenza
          const dozenConfidence = Math.max(0, (30 - reason.percentage) * 10);
          confidence += dozenConfidence;
          console.log(`- Dozzina ${reason.dozen}: +${dozenConfidence} (${reason.percentage}%)`);
          break;
        case 'zeroNeighbors':
          const zeroConfidence = Math.max(0, (20 - reason.percentage) * 10);
          confidence += zeroConfidence;
          console.log(`- Zona zero: +${zeroConfidence} (${reason.percentage}%)`);
          break;
        case 'sequence':
          confidence += 20;
          console.log('- Sequenza valida: +20');
          break;
      }
    });

    console.log(`\nConfidenza finale: ${Math.min(confidence, 100)}%`);
    return Math.min(confidence, 100);
  }
}

module.exports = new PredictionService();
