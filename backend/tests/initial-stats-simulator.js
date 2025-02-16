const mongoose = require('mongoose');
const { User } = require('../src/models');
const { InitialStatsService } = require('../src/services');

// URI per il database di test
process.env.MONGODB_URI = 'mongodb://localhost:27017/roulette-test';

async function simulateInitialStats() {
    try {
        console.log('Inizializzazione simulazione statistiche iniziali...');
        
        // Connessione al database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connesso al database');

        // Crea un utente di test
        const testUser = await User.findOneAndUpdate(
            { email: 'test@example.com' },
            {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123'
            },
            { upsert: true, new: true }
        );
        console.log('Utente di test creato:', testUser._id);
        
        const userId = testUser._id;

        // Test 1: Tavolo Raccomandato
        console.log('\n=== Test 1: Tavolo Raccomandato ===');
        const statsRecommended = {
            stats50: {
                dozens: {
                    first: 25,
                    second: 35,
                    third: 35
                },
                zeroNeighbors: 15,
                numbers: {
                    0: 6,
                    3: 5,
                    12: 4,
                    15: 7,
                    26: 3,
                    32: 5,
                    35: 4
                }
            },
            stats500: {
                dozens: {
                    first: 26,
                    second: 35,
                    third: 35
                },
                zeroNeighbors: 18,
                numbers: {
                    0: 4,
                    3: 3,
                    12: 2,
                    15: 4,
                    26: 3,
                    32: 3,
                    35: 2
                }
            }
        };

        const resultRecommended = await InitialStatsService.addInitialStats(userId, statsRecommended);
        console.log('Analisi tavolo raccomandato:', resultRecommended.analysis);
        console.log('Numeri in crescita:', resultRecommended.zeroZoneNumbers.filter(n => n.trend === 'increasing'));

        // Test 2: Tavolo Borderline
        console.log('\n=== Test 2: Tavolo Borderline ===');
        const statsBorderline = {
            stats50: {
                dozens: {
                    first: 35,
                    second: 25,
                    third: 35
                },
                zeroNeighbors: 22,
                numbers: {
                    0: 4,
                    3: 4,
                    12: 3,
                    15: 5,
                    26: 3,
                    32: 4,
                    35: 3
                }
            },
            stats500: {
                dozens: {
                    first: 35,
                    second: 26,
                    third: 35
                },
                zeroNeighbors: 21,
                numbers: {
                    0: 4,
                    3: 4,
                    12: 3,
                    15: 4,
                    26: 3,
                    32: 4,
                    35: 3
                }
            }
        };

        const resultBorderline = await InitialStatsService.addInitialStats(userId, statsBorderline);
        console.log('Analisi tavolo borderline:', resultBorderline.analysis);

        // Test 3: Tavolo Non Raccomandato
        console.log('\n=== Test 3: Tavolo Non Raccomandato ===');
        const statsNotRecommended = {
            stats50: {
                dozens: {
                    first: 32,
                    second: 32,
                    third: 32
                },
                zeroNeighbors: 21,
                numbers: {
                    0: 4,
                    3: 4,
                    12: 4,
                    15: 4,
                    26: 4,
                    32: 4,
                    35: 4
                }
            },
            stats500: {
                dozens: {
                    first: 32,
                    second: 32,
                    third: 32
                },
                zeroNeighbors: 21,
                numbers: {
                    0: 4,
                    3: 4,
                    12: 4,
                    15: 4,
                    26: 4,
                    32: 4,
                    35: 4
                }
            }
        };

        const resultNotRecommended = await InitialStatsService.addInitialStats(userId, statsNotRecommended);
        console.log('Analisi tavolo non raccomandato:', resultNotRecommended.analysis);

        console.log('\nSimulazione completata con successo!');

    } catch (error) {
        console.error('Errore durante la simulazione:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConnessione al database chiusa');
    }
}

// Esegui la simulazione
simulateInitialStats();
