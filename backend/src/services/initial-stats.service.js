const InitialStats = require('../models/initial-stats.model');
const Statistics = require('../models/statistics.model');

class InitialStatsService {
    async addInitialStats(userId, stats) {
        try {
            console.log('Dati ricevuti:', JSON.stringify(stats, null, 2));

            // Verifica che i dati necessari siano presenti
            if (!stats.stats50 || !stats.stats500) {
                throw new Error('Mancano le statistiche a 50 o 500 spin');
            }

            // Analizza le condizioni del tavolo e i numeri vicini allo zero
            const analysis = this._analyzeTableConditions(stats);
            const zeroZoneNumbers = this._analyzeZeroZoneNumbers(stats);

            // 1. Salva nelle statistiche iniziali
            const initialStats = new InitialStats({
                userId,
                stats50: {
                    dozens: {
                        first: stats.stats50.dozens.first || 0,
                        second: stats.stats50.dozens.second || 0,
                        third: stats.stats50.dozens.third || 0
                    },
                    zeroNeighbors: {
                        percentage: stats.stats50.zeroNeighbors || 0
                    }
                },
                stats500: {
                    dozens: {
                        first: stats.stats500.dozens.first || 0,
                        second: stats.stats500.dozens.second || 0,
                        third: stats.stats500.dozens.third || 0
                    },
                    zeroNeighbors: {
                        percentage: stats.stats500.zeroNeighbors || 0
                    }
                },
                zeroZoneNumbers,
                dozenDown: analysis.dozenDown,
                analysis: {
                    tableStatus: analysis.status,
                    reasons: analysis.reasons
                }
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
                    third: { count: 0, percentage: stats.stats50.dozens.third || 0 }
                },
                zeroNeighbors: {
                    total: { count: 0, percentage: stats.stats50.zeroNeighbors || 0 },
                    numbers: {}
                },
                hotNumbers: [],
                coldNumbers: [],
                sequences: []
            };

            // Aggiorna le statistiche a 500 spin
            statistics.stats500 = {
                dozens: {
                    first: { count: 0, percentage: stats.stats500.dozens.first || 0 },
                    second: { count: 0, percentage: stats.stats500.dozens.second || 0 },
                    third: { count: 0, percentage: stats.stats500.dozens.third || 0 }
                },
                zeroNeighbors: {
                    total: { count: 0, percentage: stats.stats500.zeroNeighbors || 0 },
                    numbers: {}
                },
                hotNumbers: [],
                coldNumbers: [],
                sequences: []
            };

            // Aggiorna i numeri vicini allo zero
            const zeroNeighbors = [0, 3, 12, 15, 26, 32, 35];
            zeroNeighbors.forEach(num => {
                statistics.stats50.zeroNeighbors.numbers[num] = {
                    count: 0,
                    percentage: stats.stats50.numbers[num] || 0
                };
                statistics.stats500.zeroNeighbors.numbers[num] = {
                    count: 0,
                    percentage: stats.stats500.numbers[num] || 0
                };
            });

            // Salva entrambi i modelli
            await Promise.all([
                initialStats.save(),
                statistics.save()
            ]);

            console.log('Dati salvati con successo in entrambi i modelli');
            return initialStats;
        } catch (error) {
            console.error('Errore nel salvataggio delle statistiche iniziali:', error);
            throw error;
        }
    }

    async getLatestStats(userId) {
        return await InitialStats.findOne({ userId }).sort({ timestamp: -1 });
    }

    _analyzeTableConditions(stats) {
        let status = 'not_recommended';
        let dozenDown = null;
        let reasons = [];
        const DOZEN_THRESHOLD = 29;
        const ZERO_ZONE_THRESHOLD = 19;
        const INCREASE_PERCENTAGE_THRESHOLD = 19;

        // Mappa per convertire il nome della dozzina in numero
        const dozenToNumber = {
            first: 1,
            second: 2,
            third: 3
        };

        // 1. Analisi delle dozzine
        const dozens500 = stats.stats500.dozens;
        let minDozens = {
            percentage: 100,
            dozen: null
        };

        Object.entries(dozens500).forEach(([dozen, percentage]) => {
            if (dozen !== 'zero' && percentage < minDozens.percentage) {
                minDozens.percentage = percentage;
                minDozens.dozen = dozen;
            }
        });

        // Condizione 1: Almeno una dozzina con percentuale inferiore a 29%
        const isDozenConditionMet = minDozens.percentage < DOZEN_THRESHOLD;
        if (isDozenConditionMet) {
            dozenDown = dozenToNumber[minDozens.dozen];
            reasons.push(`La dozzina ${minDozens.dozen} è in sofferenza con ${minDozens.percentage}%`);
        }

        // Condizione 2: Zona zero con percentuale inferiore a 19%
        const zeroNeighbors500 = stats.stats500.zeroNeighbors;
        const isZeroZoneConditionMet = zeroNeighbors500 < ZERO_ZONE_THRESHOLD;
        if (isZeroZoneConditionMet) {
            reasons.push(`La zona zero è in sofferenza con ${zeroNeighbors500}%`);
        }

        // Condizione 3: 2-3 numeri della zona zero con increasePercentage > 19%
        const zeroZoneNumbers = this._analyzeZeroZoneNumbers(stats);
        const numbersWithHighIncrease = zeroZoneNumbers.filter(
            num => num.increasePercentage > INCREASE_PERCENTAGE_THRESHOLD
        );
        const isZeroNumbersConditionMet = numbersWithHighIncrease.length >= 2 && numbersWithHighIncrease.length <= 3;

        if (isZeroNumbersConditionMet) {
            const increasingNumbers = numbersWithHighIncrease
                .map(num => `${num.number} (${num.increasePercentage.toFixed(1)}%)`)
                .join(', ');
            reasons.push(`${numbersWithHighIncrease.length} numeri della zona zero in crescita: ${increasingNumbers}`);
        }

        // Lo status è "recommended" solo se tutte e tre le condizioni sono soddisfatte
        if (isDozenConditionMet && isZeroZoneConditionMet && isZeroNumbersConditionMet) {
            status = 'recommended';
        }

        return {
            status,
            dozenDown,
            reasons
        };
    }

    _analyzeZeroZoneNumbers(stats) {
        const zeroNeighbors = [0, 3, 12, 15, 26, 32, 35];
        return zeroNeighbors.map(number => {
            const short = stats.stats50.numbers[number] || 0;
            const long = stats.stats500.numbers[number] || 0;

            // Calcola la differenza percentuale (positiva se in crescita, negativa se in diminuzione)
            const increasePercentage = long - short;

            return {
                number,
                increasePercentage
            };
        });
    }

    _calculateStandardDeviation(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }

    _getDozenName(dozen) {
        const names = {
            first: 'prima dozzina',
            second: 'seconda dozzina',
            third: 'terza dozzina'
        };
        return names[dozen] || dozen;
    }
}

module.exports = new InitialStatsService();
