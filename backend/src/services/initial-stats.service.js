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
                        third: stats.stats50.dozens.third || 0,
                        zero: stats.stats50.dozens.zero || 0
                    },
                    zeroNeighbors: {
                        percentage: stats.stats50.zeroNeighbors || 0
                    }
                },
                stats500: {
                    dozens: {
                        first: stats.stats500.dozens.first || 0,
                        second: stats.stats500.dozens.second || 0,
                        third: stats.stats500.dozens.third || 0,
                        zero: stats.stats500.dozens.zero || 0
                    },
                    zeroNeighbors: {
                        percentage: stats.stats500.zeroNeighbors || 0
                    }
                },
                zeroZoneNumbers,
                analysis
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
                    zero: { count: 0, percentage: stats.stats50.dozens.zero || 0 }
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
                    third: { count: 0, percentage: stats.stats500.dozens.third || 0 },
                    zero: { count: 0, percentage: stats.stats500.dozens.zero || 0 }
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
        const reasons = [];
        let status = 'recommended';

        // Analisi dozzine a 500 spin
        const dozens500 = stats.stats500.dozens;
        let hasSufferingDozen = false;
        
        Object.entries(dozens500).forEach(([dozen, percentage]) => {
            if (dozen !== 'zero' && percentage < 28) {
                hasSufferingDozen = true;
                reasons.push(`Dozzina ${dozen} in sofferenza (${percentage.toFixed(1)}%)`);
            }
        });

        if (!hasSufferingDozen) {
            status = 'not_recommended';
            reasons.push('Nessuna dozzina in sofferenza');
        }

        // Analisi zona zero
        const zeroNeighbors500 = stats.stats500.zeroNeighbors;
        if (zeroNeighbors500 < 20) {
            if (status !== 'not_recommended') {
                status = 'recommended';
            }
            reasons.push(`Zona zero in sofferenza (${zeroNeighbors500.toFixed(1)}%)`);
        }

        return {
            tableStatus: status,
            reasons
        };
    }

    _analyzeZeroZoneNumbers(stats) {
        const zeroNeighbors = [0, 3, 12, 15, 26, 32, 35];
        return zeroNeighbors.map(number => {
            const short = stats.stats50.numbers[number] || 0;
            const long = stats.stats500.numbers[number] || 0;

            let trend = 'stable';
            if (short > long) {
                trend = 'increasing';
            } else if (short < long) {
                trend = 'decreasing';
            }

            return {
                number,
                trend,
                shortTermPercentage: short,
                longTermPercentage: long
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
