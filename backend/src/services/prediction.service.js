const statisticsRepository = require('../repositories/statistics.repository');
const initialStatsService = require('./initial-stats.service');
const { expandGroups } = require('../config/roulette.groups');
const { SEQUENCES } = require('../config/roulette.sequences');

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
    
    const increasingNumbersArray = increasingNumbers.map(n => n.number);

    const special = [];
    const primary = [];
    const secondary = [];

    sequenceNumbers.forEach(number => {
      const isInIncreasing = increasingNumbersArray.includes(number);
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

    if (SEQUENCES[lastNumber]) {
      const expanded = expandGroups(SEQUENCES[lastNumber]);
      expanded.forEach(num => numbers.add(num));
    }

    return Array.from(numbers);
  }

  async getPredictions(userId) {
    try {
      const stats = await this._getStats(userId);
      const lastNumber = stats.lastSpin.number;
      const sequenceNumbers = this._getSequenceNumbers(lastNumber);
      const initialStats = await initialStatsService.getLatestStats(userId);
      
      const increasingNumbers = initialStats ? 
        initialStats.zeroZoneNumbers
          .filter(n => n.increasePercentage > 3)
          .map(n => ({
            number: n.number,
            increasePercentage: n.increasePercentage
          }))
          .sort((a, b) => b.increasePercentage - a.increasePercentage) : [];

      const categorizedNumbers = this._categorizeNumbers(
        sequenceNumbers, 
        increasingNumbers, 
        initialStats?.dozenDown
      );

      return {
        lastNumber,
        ...categorizedNumbers,
      };
    } catch (error) {
      console.error('Error in getPredictions:', error);
      throw error;
    }
  }
}

module.exports = new PredictionService();
