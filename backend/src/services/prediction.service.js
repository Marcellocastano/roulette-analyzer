const statisticsRepository = require('../repositories/statistics.repository');
const initialStatsService = require('./initial-stats.service');
const { expandGroups } = require('../config/roulette.groups');
const { SEQUENCES, ZONE_ZERO_NUMBERS, DIRECT_SEQUENCES } = require('../config/roulette.sequences');
const { ROULETTE_WHEEL } = require('../config/roulette.numbers');
const { SURPLUS_THRESHOLD, INCREASE_PERCENTAGE_THRESHOLD } = require('../config/roulette.thresholds');

class PredictionService {
  constructor() {
    this.repository = statisticsRepository;
  }

  _getDozensNumbers() {
    return {
      1: Array.from({length: 12}, (_, i) => i + 1),      // 1-12
      2: Array.from({length: 12}, (_, i) => i + 13),     // 13-24
      3: Array.from({length: 12}, (_, i) => i + 25)      // 25-36
    };
  }

  _categorizeNumbers(sequenceNumbers, increasingNumbers, dozenDown) {
    const dozenNumbers = dozenDown ? this._getDozensNumbers()[dozenDown] : [];

    const special = [];
    const primary = [];
    const secondary = [];

    sequenceNumbers.forEach(number => {
      const isInIncreasing = increasingNumbers.includes(number);
      const isInDozen = dozenNumbers.includes(number);

      if (isInIncreasing && isInDozen) {
        special.push(number);
      } else if (isInIncreasing || isInDozen) {
        primary.push(number);
      } else {
        secondary.push(number);
      }
    });

    return {
      special: special.sort((a, b) => a - b),
      primary: primary.sort((a, b) => a - b),
      secondary: secondary.sort((a, b) => a - b)
    };
  }

  async _getStats(userId) {
    const spinHistory = await this.repository.getSpinHistory(userId);
    if (!spinHistory || !Array.isArray(spinHistory) || spinHistory.length === 0) {
      throw new Error('No spin history found');
    }

    const lastSpin = spinHistory[0];
    return {
      spinHistory,
      lastSpin
    };
  }

  _getSequenceNumbers(lastNumber) {
    const numbers = new Set();
    
    // 1. Aggiungi sempre il gruppo ZERO_NEIGHBORS
    const zeroNeighbors = expandGroups(['ZERO_NEIGHBORS']);
    zeroNeighbors.forEach(num => numbers.add(num));
    
    // 2. Aggiungi il numero estratto e i suoi adiacenti sulla ruota
    numbers.add(parseInt(lastNumber)); // Aggiungi il numero stesso
    
    // Aggiungi i numeri adiacenti sulla ruota
    const neighbors = this._getNeighborsOnWheel(parseInt(lastNumber));
    neighbors.forEach(num => numbers.add(num));
    
    // 3. Aggiungi le sequenze predefinite per il numero
    if (SEQUENCES[lastNumber]) {
      const expanded = expandGroups(SEQUENCES[lastNumber]);
      expanded.forEach(num => numbers.add(num));
    }

    return Array.from(numbers);
  }

  _getNeighborsOnWheel(num) {
    // Trova l'indice del numero nella ruota
    const idx = ROULETTE_WHEEL.indexOf(num);
    if (idx === -1) {
      // Se il numero non è presente nella ruota, ritorna un array vuoto
      return [];
    }
    // Calcola gli indici dei vicini
    const leftIndex = (idx - 1 + ROULETTE_WHEEL.length) % ROULETTE_WHEEL.length;
    const rightIndex = (idx + 1) % ROULETTE_WHEEL.length;
  
    // Ritorna i due vicini
    return [ROULETTE_WHEEL[leftIndex], ROULETTE_WHEEL[rightIndex]];
  }  

  _isZeroNumber(num) {
    return ZONE_ZERO_NUMBERS.includes(num);
  }

  _findSurplusDozen(initialStats) {
    // Ricaviamo le percentuali a 50 e 500 spin
    const { stats50, stats500 } = initialStats;
    
    // Calcoliamo la media per ciascuna dozzina
    const firstAvg = (stats50.dozens.first + stats500.dozens.first) / 2;
    const secondAvg = (stats50.dozens.second + stats500.dozens.second) / 2;
    const thirdAvg = (stats50.dozens.third + stats500.dozens.third) / 2;
  
    // Troviamo la dozzina con la media più alta
    let maxDozen = 'first';
    let maxValue = firstAvg;
  
    if (secondAvg > maxValue) {
      maxDozen = 'second';
      maxValue = secondAvg;
    }
    if (thirdAvg > maxValue) {
      maxDozen = 'third';
      maxValue = thirdAvg;
    }
  
    // Se la dozzina più alta supera la soglia, la consideriamo in surplus
    if (maxValue >= SURPLUS_THRESHOLD) {
      return maxDozen; // "first", "second" o "third"
    }
    // Altrimenti, nessuna dozzina è in surplus
    return null;
  }
  

  _refineSequenceNumbers(sequenceNumbers, initialStats) {
    const { dozenDown, analysis, dozenUp } = initialStats || {};
    const { reasonCodes = [], increasingNumbers = [] } = analysis || {};
  
    // Identifichiamo se la zona zero è in sofferenza
    const zeroZoneIsSuffering = reasonCodes.includes('ZERO_ZONE_SUFFERING');
  
    // Identifichiamo la dozzina sofferente e quella in surplus
    const sufferingDozen = dozenDown;
    const surplusDozen = dozenUp;
    // 1. Partiamo dalla base: i numeri di sequenza
    let refined = new Set(sequenceNumbers);
  
    // 2. Rimuoviamo i numeri agli estremi delle sequenze se appartengono alla dozzina in surplus
    if (surplusDozen) {
      for (let sequence of Object.values(SEQUENCES)) {
        const expandedSequence = expandGroups(sequence);
        const firstNum = expandedSequence[0];
        const lastNum = expandedSequence[expandedSequence.length - 1];
        
        // Rimuovi i numeri agli estremi se sono nella dozzina in surplus e non sono nella zona zero
        if (this._isNumberInDozen(firstNum, surplusDozen) && !this._isZeroNumber(firstNum)) {
          refined.delete(firstNum);
        }
        if (this._isNumberInDozen(lastNum, surplusDozen) && !this._isZeroNumber(lastNum)) {
          refined.delete(lastNum);
        }
      }
    }
  
    // 3. Aggiungiamo i "vicini" dei numeri se appartengono alla dozzina sofferente o sono in zona zero
    const neighborsToAdd = [];

    // Raccogli tutti i potenziali vicini da aggiungere
    for (let num of refined) {
      const neighbors = this._getNeighborsOnWheel(num);
      
      neighbors.forEach(n => {
        // Verifica se il vicino è già presente in refined
        if (!refined.has(n)) {
          const isInSufferingDozen = this._isNumberInDozen(n, sufferingDozen);
          const isZeroNumber = this._isZeroNumber(n);
          const isInGrowth = increasingNumbers.includes(n);
          
          if (
            (isInSufferingDozen) ||
            (zeroZoneIsSuffering && isZeroNumber) ||
            (isInGrowth)
          ) {
            neighborsToAdd.push(n);
          }
        }
      });
    }

    // Calcola quanti elementi possiamo ancora aggiungere
    const currentSize = refined.size;
    const availableSlots = Math.max(0, 15 - currentSize);

    // Se abbiamo spazio disponibile e ci sono vicini da aggiungere
    if (availableSlots > 0 && neighborsToAdd.length > 0) {
      // Se abbiamo più vicini di quelli che possiamo aggiungere, ne scegliamo alcuni casualmente
      if (neighborsToAdd.length > availableSlots) {
        // Mescola l'array di vicini per selezionare casualmente
        for (let i = neighborsToAdd.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [neighborsToAdd[i], neighborsToAdd[j]] = [neighborsToAdd[j], neighborsToAdd[i]];
        }
        
        // Prendi solo il numero di vicini che possiamo aggiungere
        neighborsToAdd.length = availableSlots;
      }
      
      // Aggiungi i vicini selezionati
      neighborsToAdd.forEach(n => refined.add(n));
    }
    
    // 4. Assicuriamoci che tutti i numeri della zona zero siano inclusi
    ZONE_ZERO_NUMBERS.forEach(n => refined.add(n));
  
    // 5. Ritorna la lista finale ordinata
    return Array.from(refined).sort((a, b) => a - b);
  }
  
  _classifyNumbers(refinedNumbers, initialStats, lastNumber) {
    const { dozenDown, analysis } = initialStats || {};
    const { increasingNumbers = [] } = analysis || {};
  
    const special = [];
    const primary = [];
    const secondary = [];
  
    for (let number of refinedNumbers) {
      const isInIncreasing = increasingNumbers.includes(number);
      const isInDozenDown = this._isNumberInDozen(number, dozenDown);
      const isZeroGrowing = this._isZeroNumberInGrowth(number, initialStats);
      const isInDirectSequence = DIRECT_SEQUENCES[lastNumber].includes(number);
      // SPECIAL: se (zona zero in crescita) E (dozzina sofferente) OPPURE se è lo 0 ed è in crescita
      if ((isZeroGrowing && isInDozenDown && isInIncreasing) || (number === 0 && isZeroGrowing)) {
        special.push(number);
      }
      // PRIMARY: se è in una sequenza diretta E (appartiene alla dozzina sofferente OPPURE è in crescita e in aumento)
      else if ((isInDirectSequence && isInDozenDown) || (isZeroGrowing && (isInIncreasing || isInDozenDown))) {
        primary.push(number);
      }
      // SECONDARY: tutti gli altri (che non rientrano in special/primary)
      else {
        secondary.push(number);
      }
    }
  
    return {
      special: special.sort((a, b) => a - b),
      primary: primary.sort((a, b) => a - b),
      secondary: secondary.sort((a, b) => a - b),
    };
  }
  
  // Esempio di funzione di supporto
  _isZeroNumberInGrowth(number, initialStats) {
    // Se la zona zero è in sofferenza E questo numero è uno di quelli
    // con increasePercentage >= soglia
    const zeroNumbers = initialStats?.zeroZoneNumbers || [];
    const found = zeroNumbers.find(z => z.number === number);
    if (!found) return false;
  
    const zeroZoneIsSuffering = initialStats.analysis?.reasonCodes?.includes('ZERO_ZONE_SUFFERING');
    if (zeroZoneIsSuffering && found.increasePercentage >= INCREASE_PERCENTAGE_THRESHOLD) {
      return true;
    }
    return false;
  }
  

  _calculateScores(lastNumber, initialStats) {
    // 1. Ricava i dati base
    const { dozenDown, dozenUp, analysis } = initialStats || {};
    const { reasonCodes = [], increasingNumbers = [] } = analysis || {};

    // Controlliamo se la zona zero è in sofferenza
    const zeroZoneIsSuffering = reasonCodes.includes('ZERO_ZONE_SUFFERING');

    // Identifichiamo la dozzina in sofferenza (es. 1, 2 o 3)
    const sufferingDozen = dozenDown; // es: 2

    // 2. Definiamo i pesi (tarali in base alle prove)
    const WEIGHT_SEQUENCE = 2;
    const WEIGHT_DOZEN_SUFFERING = 2;
    const WEIGHT_ZERO_SUFFERING = 1; // Se numero appartiene a zona zero sofferente
    const WEIGHT_INCREASING = 1;
    const WEIGHT_EXCLUDING_SURPLUS = -2; // Penalità se dozzina è “in surplus”

    // (Opzionale) Identifichiamo la dozzina in surplus, se serve
    // Per semplicità, qui non lo calcoliamo, ma potresti dedurla da initialStats.

    // 3. Calcoliamo i punteggi
    const scores = [];
    for (let n = 0; n <= 36; n++) {
      let score = 0;

      // A) Verifica se n fa parte di una sequenza che segue l’ultimo numero
      //    (usando la logica attuale)
      const seqNumbers = this._getSequenceNumbers(lastNumber); 
      // seqNumbers -> array di numeri che seguono l'ultimo estratto
      if (seqNumbers.includes(n)) {
        score += WEIGHT_SEQUENCE;
      }

      // B) Dozzina sofferente
      const isInSufferingDozen = this._isNumberInDozen(n, sufferingDozen);
      if (isInSufferingDozen) {
        score += WEIGHT_DOZEN_SUFFERING;
      }

      // C) Zona zero sofferente
      const isZeroNumber = ZONE_ZERO_NUMBERS.includes(n);
      if (zeroZoneIsSuffering && isZeroNumber) {
        score += WEIGHT_ZERO_SUFFERING;
      }

      // D) Numero in crescita
      if (increasingNumbers.includes(n)) {
        score += WEIGHT_INCREASING;
      }

      // E) (Opzionale) Se la dozzina di n è in surplus, penalizza
      // (Da implementare se vuoi escludere i numeri di dozzine “troppo alte”)
      // const isInSurplusDozen = ...
      // if (isInSurplusDozen) {
      //   score += WEIGHT_EXCLUDING_SURPLUS;
      // }

      scores.push({ number: n, score });
    }

    // 4. Restituiamo l’array con tutti i punteggi
    return scores;
  }

  /**
   * Verifica se un numero n appartiene alla dozzina sufferingDozen (1,2,3).
   */
  _isNumberInDozen(n, sufferingDozen) {
    if (!sufferingDozen) return false;
    if (sufferingDozen === 1) return n >= 1 && n <= 12;
    if (sufferingDozen === 2) return n >= 13 && n <= 24;
    if (sufferingDozen === 3) return n >= 25 && n <= 36;
    return false;
  }

  /**
   * Nuova logica di categorizzazione basata sul punteggio
   */
  _categorizeNumbersByScore(scores) {
    // Ordina i numeri per punteggio decrescente
    const sorted = scores.sort((a, b) => b.score - a.score);

    // Soglie di esempio (puoi modificarle):
    // - Special: score >= 4
    // - Primary: score >= 2
    // - Secondary: score >= 1
    // - Escludi (score < 1)
    const special = [];
    const primary = [];
    const secondary = [];

    for (let { number, score } of sorted) {
      if (score >= 4) {
        special.push(number);
      } else if (score >= 2) {
        primary.push(number);
      } else if (score >= 1) {
        secondary.push(number);
      }
      // else scartiamo i numeri con score < 1
    }

    return {
      special: special.sort((a, b) => a - b),
      primary: primary.sort((a, b) => a - b),
      secondary: secondary.sort((a, b) => a - b),
    };
  }

  async getPredictions(userId) {
    try {
      const { spinHistory, lastSpin } = await this._getStats(userId);
      const lastNumber = lastSpin.number;
  
      // 1. Otteniamo la base di sequenza
      const sequenceNumbers = this._getSequenceNumbers(lastNumber);
  
      // 2. Otteniamo le statistiche iniziali
      const initialStats = await initialStatsService.getLatestStats(userId);
  
      // 3. Refinement: aggiunte/rimozioni
      const refinedNumbers = this._refineSequenceNumbers(sequenceNumbers, initialStats);
  
      // 4. Classificazione
      const categorized = this._classifyNumbers(refinedNumbers, initialStats, lastNumber);
  
      return {
        lastNumber,
        ...categorized
      };
    } catch (error) {
      console.error('Error in getPredictions:', error);
      throw error;
    }
  }
  
}

module.exports = new PredictionService();
