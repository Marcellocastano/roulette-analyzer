const InitialStats = require("../models/initial-stats.model");
const UserModel = require("../models/user.model");
const Statistics = require("../models/statistics.model");
const { AppError } = require('../middlewares/errorHandler');
const {
  DOZEN_MIN_THRESHOLD,
  DOZEN_MAX_THRESHOLD,
  ZERO_ZONE_THRESHOLD,
  INCREASE_PERCENTAGE_THRESHOLD,
} = require("../config/roulette.thresholds");

// Enum per i reason codes
const ReasonCode = {
  DOZEN_SUFFERING: "DOZEN_SUFFERING",
  DOZEN_MIN_THRESHOLD: "DOZEN_MIN_THRESHOLD",
  ZERO_ZONE_SUFFERING: "ZERO_ZONE_SUFFERING",
  ZERO_ZONE_THRESHOLD: "ZERO_ZONE_THRESHOLD",
  INCREASING_NUMBERS: "INCREASING_NUMBERS",
};

class InitialStatsService {
  async addInitialStats(userId, stats) {
    try {
      const subscriptionRepository = require('../repositories/subscription.repository');
      const user = await UserModel.findById(userId);
      if (!user.activeSubscription) {
        throw new AppError('Non hai un abbonamento attivo', 403);
      }
      const sessionCheck = await subscriptionRepository.checkSessionLimit(user.activeSubscription);
      if (!sessionCheck.allowed) {
        throw new AppError(sessionCheck.message, 400);
      }
      
      await InitialStats.deleteMany({ userId });
      await Statistics.deleteOne({ user: userId });

      if (!stats.stats50 || !stats.stats500) {
        throw new Error("Mancano le statistiche a 50 o 500 spin");
      }

      const analysis = this._analyzeTableConditions(stats);
      const zeroZoneNumbers = this._analyzeZeroZoneNumbers(stats);

      const initialStats = new InitialStats({
        userId,
        stats50: {
          dozens: {
            first: stats.stats50.dozens.first || 0,
            second: stats.stats50.dozens.second || 0,
            third: stats.stats50.dozens.third || 0,
          },
          zeroNeighbors: {
            percentage: stats.stats50.zeroNeighbors || 0,
          },
        },
        stats500: {
          dozens: {
            first: stats.stats500.dozens.first || 0,
            second: stats.stats500.dozens.second || 0,
            third: stats.stats500.dozens.third || 0,
          },
          zeroNeighbors: {
            percentage: stats.stats500.zeroNeighbors || 0,
          },
        },
        zeroZoneNumbers,
        dozenDown: analysis.dozenDown,
        dozenUp: analysis.dozenUp,
        analysis: {
          tableStatus: analysis.status,
          reasonCodes: analysis.reasonCodes,
          increasingNumbers: analysis.increasingNumbers,
        },
        active: true,
        timestamp: new Date()
      });

      // 2. Salva nel modello Statistics
      let statistics = await Statistics.findOne({ user: userId });
      if (!statistics) {
        statistics = new Statistics({ user: userId });
      }

      // Aggiorna le statistiche a 50 spin
      statistics.stats50 = {
        dozens: {
          first: { count: 0, percentage: stats.stats50.dozens.first || 0 },
          second: { count: 0, percentage: stats.stats50.dozens.second || 0 },
          third: { count: 0, percentage: stats.stats50.dozens.third || 0 },
        },
        zeroNeighbors: {
          total: { count: 0, percentage: stats.stats50.zeroNeighbors || 0 },
          numbers: {},
        },
        hotNumbers: [],
        coldNumbers: [],
        sequences: [],
      };

      // Aggiorna le statistiche a 500 spin
      statistics.stats500 = {
        dozens: {
          first: { count: 0, percentage: stats.stats500.dozens.first || 0 },
          second: { count: 0, percentage: stats.stats500.dozens.second || 0 },
          third: { count: 0, percentage: stats.stats500.dozens.third || 0 },
        },
        zeroNeighbors: {
          total: { count: 0, percentage: stats.stats500.zeroNeighbors || 0 },
          numbers: {},
        },
        hotNumbers: [],
        coldNumbers: [],
        sequences: [],
      };

      // Aggiorna i numeri vicini allo zero
      const zeroNeighbors = [0, 3, 12, 15, 26, 32, 35];
      zeroNeighbors.forEach((num) => {
        statistics.stats50.zeroNeighbors.numbers[num] = {
          count: 0,
          percentage: stats.stats50.numbers[num] || 0,
        };
        statistics.stats500.zeroNeighbors.numbers[num] = {
          count: 0,
          percentage: stats.stats500.numbers[num] || 0,
        };
      });

      // Salva entrambi i modelli
      await Promise.all([initialStats.save(), statistics.save()]);
      return initialStats;
    } catch (error) {
      console.error(
        "Errore nel salvataggio delle statistiche iniziali:",
        error
      );
      throw error;
    }
  }

  async getLatestStats(userId) {
    return await InitialStats.findOne({ userId }).sort({ timestamp: -1 });
  }

  _analyzeTableConditions(stats) {
    // Calcola le medie tra stats50 e stats500
    const averageStats = this._calculateAverageStats(stats);

    // Analisi delle dozzine usando le medie
    const {
      minDozens,
      isMinDozenConditionMet,
      maxDozens,
      isMaxDozenConditionMet,
    } = this._analyzeDozens(
      averageStats.dozens,
      DOZEN_MIN_THRESHOLD,
      DOZEN_MAX_THRESHOLD
    );

    // Analisi della zona zero usando le medie
    const zeroNeighborsAvg = averageStats.zeroNeighbors;
    const isZeroZoneConditionMet = zeroNeighborsAvg < ZERO_ZONE_THRESHOLD;
    const isZeroZoneAtThreshold = zeroNeighborsAvg === ZERO_ZONE_THRESHOLD;

    // Analisi dei numeri della zona zero in crescita
    const { numbersWithHighIncrease, isZeroNumbersConditionMet } =
      this._analyzeZeroNumbersIncrease(stats, INCREASE_PERCENTAGE_THRESHOLD);

    // Determina lo status del tavolo e raccoglie le ragioni
    const { status, reasons, reasonCodes } = this._determineTableStatus({
      isMinDozenConditionMet,
      isZeroZoneConditionMet,
      isZeroNumbersConditionMet,
      isZeroZoneAtThreshold,
      minDozens,
      zeroNeighborsAvg,
      numbersWithHighIncrease,
      DOZEN_MIN_THRESHOLD,
      DOZEN_MAX_THRESHOLD,
      ZERO_ZONE_THRESHOLD,
      stats,
    });

    return {
      status,
      dozenDown: isMinDozenConditionMet
        ? this._dozenNameToNumber(minDozens.dozen)
        : null,
      dozenUp: isMaxDozenConditionMet
        ? this._dozenNameToNumber(maxDozens.dozen)
        : null,
      reasons,
      reasonCodes,
      increasingNumbers: numbersWithHighIncrease.map((num) => num.number),
    };
  }

  _calculateAverageStats(stats) {
    // Restituisci le dozzine a 500 spin
    const dozens = {
      first: stats.stats500.dozens.first,
      second: stats.stats500.dozens.second,
      third: stats.stats500.dozens.third,
    };

    // Calcola la media della zona zero
    const zeroNeighbors =
      (stats.stats50.zeroNeighbors + stats.stats500.zeroNeighbors) / 2;

    return {
      dozens,
      zeroNeighbors,
    };
  }

  _analyzeDozens(dozens500, minThreshold, maxThreshold) {
    let minDozens = {
      percentage: 100,
      dozen: null,
    };
    let maxDozens = {
      percentage: 0,
      dozen: null,
    };

    Object.entries(dozens500).forEach(([dozen, percentage]) => {
      if (dozen !== "zero" && percentage < minDozens.percentage) {
        minDozens.percentage = percentage;
        minDozens.dozen = dozen;
      }
    });

    Object.entries(dozens500).forEach(([dozen, percentage]) => {
      if (dozen !== "zero" && percentage > maxDozens.percentage) {
        maxDozens.percentage = percentage;
        maxDozens.dozen = dozen;
      }
    });

    return {
      minDozens,
      isMinDozenConditionMet: minDozens.percentage < minThreshold,
      maxDozens,
      isMaxDozenConditionMet: maxDozens.percentage > maxThreshold,
    };
  }

  _analyzeZeroNumbersIncrease(stats, threshold) {
    const zeroZoneNumbers = this._analyzeZeroZoneNumbers(stats);
    const numbersWithHighIncrease = zeroZoneNumbers.filter(
      (num) => num.increasePercentage > threshold
    );

    const isZeroNumbersConditionMet =
      numbersWithHighIncrease.length >= 2 &&
      numbersWithHighIncrease.length <= 4;
    return {
      numbersWithHighIncrease,
      isZeroNumbersConditionMet,
    };
  }

  _determineTableStatus({
    isMinDozenConditionMet,
    isZeroZoneConditionMet,
    isZeroNumbersConditionMet,
    isZeroZoneAtThreshold,
    minDozens,
    zeroNeighborsAvg,
    numbersWithHighIncrease,
    DOZEN_MIN_THRESHOLD,
    ZERO_ZONE_THRESHOLD,
    stats,
  }) {
    const reasons = [];
    const reasonCodes = [];
    let status = "not_recommended";

    // Controlla se tutte le condizioni sono soddisfatte per lo status "recommended"
    if (
      isMinDozenConditionMet &&
      isZeroZoneConditionMet &&
      isZeroNumbersConditionMet
    ) {
      status = "recommended";
      this._addRecommendedReasons(
        reasons,
        minDozens,
        zeroNeighborsAvg,
        numbersWithHighIncrease,
        stats
      );
      reasonCodes.push(ReasonCode.DOZEN_SUFFERING);
      reasonCodes.push(ReasonCode.ZERO_ZONE_SUFFERING);
      if (numbersWithHighIncrease.length > 0) {
        reasonCodes.push(ReasonCode.INCREASING_NUMBERS);
      }
    }
    // Controlla le condizioni per lo status "borderline"
    else if (
      // Caso 1: Una condizione al limite e numeri della zona zero in crescita
      (minDozens.percentage <= DOZEN_MIN_THRESHOLD ||
        zeroNeighborsAvg <= ZERO_ZONE_THRESHOLD) &&
      isZeroNumbersConditionMet
      // Caso 2: Entrambe le condizioni soddisfatte (dozzina e zona zero)
      // (isMinDozenConditionMet && isZeroZoneConditionMet)
    ) {
      status = "borderline";
      this._addBorderlineReasons(
        reasons,
        minDozens,
        zeroNeighborsAvg,
        isMinDozenConditionMet,
        isZeroZoneConditionMet,
        DOZEN_MIN_THRESHOLD,
        ZERO_ZONE_THRESHOLD,
        stats
      );

      // Aggiungi i reason codes appropriati
      if (minDozens.percentage === DOZEN_MIN_THRESHOLD) {
        reasonCodes.push(ReasonCode.DOZEN_MIN_THRESHOLD);
      } else if (isMinDozenConditionMet) {
        reasonCodes.push(ReasonCode.DOZEN_SUFFERING);
      }

      if (zeroNeighborsAvg === ZERO_ZONE_THRESHOLD) {
        reasonCodes.push(ReasonCode.ZERO_ZONE_THRESHOLD);
      } else if (isZeroZoneConditionMet) {
        reasonCodes.push(ReasonCode.ZERO_ZONE_SUFFERING);
      }

      if (isZeroNumbersConditionMet) {
        reasonCodes.push(ReasonCode.INCREASING_NUMBERS);
      }
    }

    return { status, reasons, reasonCodes };
  }

  _addRecommendedReasons(
    reasons,
    minDozens,
    zeroNeighborsAvg,
    numbersWithHighIncrease,
    stats
  ) {
    // Messaggio per la dozzina
    reasons.push(`La ${this._getDozenName(minDozens.dozen)} è in sofferenza:`);
    reasons.push(`• Media: ${minDozens.percentage.toFixed(1)}%`);
    reasons.push(
      `• A 50 spin: ${stats.stats50.dozens[minDozens.dozen].toFixed(1)}%`
    );
    reasons.push(
      `• A 500 spin: ${stats.stats500.dozens[minDozens.dozen].toFixed(1)}%`
    );

    // Messaggio per la zona zero
    reasons.push(`\nLa zona zero è in sofferenza:`);
    reasons.push(`• Media: ${zeroNeighborsAvg.toFixed(1)}%`);
    reasons.push(`• A 50 spin: ${stats.stats50.zeroNeighbors.toFixed(1)}%`);
    reasons.push(`• A 500 spin: ${stats.stats500.zeroNeighbors.toFixed(1)}%`);

    // Messaggio per i numeri in crescita
    const increasingNumbers = numbersWithHighIncrease
      .map((num) => `${num.number} (${num.increasePercentage.toFixed(1)}%)`)
      .join(", ");
    reasons.push(
      `\n${numbersWithHighIncrease.length} numeri della zona zero in crescita: ${increasingNumbers}`
    );
  }

  _addBorderlineReasons(
    reasons,
    minDozens,
    zeroNeighborsAvg,
    isMinDozenConditionMet,
    isZeroZoneConditionMet,
    DOZEN_MIN_THRESHOLD,
    ZERO_ZONE_THRESHOLD,
    stats
  ) {
    reasons.push("⚠️ Situazione borderline rilevata:");

    // Messaggio per la dozzina
    if (minDozens.percentage === DOZEN_MIN_THRESHOLD) {
      reasons.push(
        `\n✓ La ${this._getDozenName(minDozens.dozen)} è al limite:`
      );
      reasons.push(`  • Media: ${minDozens.percentage.toFixed(1)}%`);
      reasons.push(
        `  • A 50 spin: ${stats.stats50.dozens[minDozens.dozen].toFixed(1)}%`
      );
      reasons.push(
        `  • A 500 spin: ${stats.stats500.dozens[minDozens.dozen].toFixed(1)}%`
      );
    } else if (isMinDozenConditionMet) {
      reasons.push(
        `\n✓ La ${this._getDozenName(minDozens.dozen)} è in sofferenza:`
      );
      reasons.push(`  • Media: ${minDozens.percentage.toFixed(1)}%`);
      reasons.push(
        `  • A 50 spin: ${stats.stats50.dozens[minDozens.dozen].toFixed(1)}%`
      );
      reasons.push(
        `  • A 500 spin: ${stats.stats500.dozens[minDozens.dozen].toFixed(1)}%`
      );
    }

    // Messaggio per la zona zero
    if (zeroNeighborsAvg === ZERO_ZONE_THRESHOLD) {
      reasons.push(`\n✓ La zona zero è al limite:`);
      reasons.push(`  • Media: ${zeroNeighborsAvg.toFixed(1)}%`);
      reasons.push(`  • A 50 spin: ${stats.stats50.zeroNeighbors.toFixed(1)}%`);
      reasons.push(
        `  • A 500 spin: ${stats.stats500.zeroNeighbors.toFixed(1)}%`
      );
    } else if (isZeroZoneConditionMet) {
      reasons.push(`\n✓ La zona zero è in sofferenza:`);
      reasons.push(`  • Media: ${zeroNeighborsAvg.toFixed(1)}%`);
      reasons.push(`  • A 50 spin: ${stats.stats50.zeroNeighbors.toFixed(1)}%`);
      reasons.push(
        `  • A 500 spin: ${stats.stats500.zeroNeighbors.toFixed(1)}%`
      );
    }
  }

  _dozenNameToNumber(dozen) {
    return { first: 1, second: 2, third: 3 }[dozen] || null;
  }

  _analyzeZeroZoneNumbers(stats) {
    const zeroNeighbors = [0, 3, 12, 15, 26, 32, 35];
    return zeroNeighbors.map((number) => {
      const short = stats.stats50.numbers[number] || 0;
      const long = stats.stats500.numbers[number] || 0;

      // Calcola la differenza percentuale (positiva se in crescita, negativa se in diminuzione)
      const increasePercentage = long - short;

      return {
        number,
        increasePercentage,
      };
    });
  }

  _calculateStandardDeviation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map((value) => Math.pow(value - mean, 2));
    const avgSquareDiff =
      squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  _getDozenName(dozen) {
    const names = {
      first: "prima dozzina",
      second: "seconda dozzina",
      third: "terza dozzina",
    };
    return names[dozen] || dozen;
  }
}

module.exports = new InitialStatsService();
