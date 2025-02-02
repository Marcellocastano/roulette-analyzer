const mongoose = require('mongoose');
const { User } = require('../src/models');
const { StatsService } = require('../src/services');

// URI per il database di test
process.env.MONGODB_URI = 'mongodb://localhost:27017/roulette-test';

async function simulateRouletteSession() {
  try {
    console.log('Inizializzazione simulazione...');
    
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

    const stats = new StatsService();
    console.log('Servizio statistiche inizializzato');
    
    const userId = testUser._id;
    const results = {
      predictions: [],
      hits: 0,
      totalSpins: 0,
      confidenceScores: [],
      correlationHits: 0
    };

    // Simula solo 10 spin iniziali
    console.log('Generazione base statistica iniziale...');
    const initialSpins = [0, 32, 15, 19, 4, 13, 14, 16, 17, 25]; // Numeri che includono alcune sequenze note
    for (const number of initialSpins) {
      await stats.addSpin(userId, number);
      process.stdout.write('.');
    }
    console.log('\nBase statistica completata');

    console.log('Inizio simulazione predizioni...');
    // Riduciamo anche il numero di round a 20 per il test
    for (let round = 0; round < 20; round++) {
      console.log(`\n=== Round ${round + 1} ===`);
      
      try {
        // Ottieni statistiche correnti
        const currentStats = await stats.getStatistics(userId);
        console.log('\nStatistiche attuali:');
        
        // Dozzine a 50 spin
        console.log('Dozzine (ultimi 50 spin):');
        console.log(`- Prima dozzina (1-12): ${currentStats.short_term.dozens.first.percentage.toFixed(1)}%`);
        console.log(`- Seconda dozzina (13-24): ${currentStats.short_term.dozens.second.percentage.toFixed(1)}%`);
        console.log(`- Terza dozzina (25-36): ${currentStats.short_term.dozens.third.percentage.toFixed(1)}%`);
        console.log(`- Zero: ${currentStats.short_term.dozens.zero.percentage.toFixed(1)}%`);

        // Dozzine a 500 spin
        console.log('\nDozzine (ultimi 500 spin):');
        console.log(`- Prima dozzina (1-12): ${currentStats.long_term.dozens.first.percentage.toFixed(1)}%`);
        console.log(`- Seconda dozzina (13-24): ${currentStats.long_term.dozens.second.percentage.toFixed(1)}%`);
        console.log(`- Terza dozzina (25-36): ${currentStats.long_term.dozens.third.percentage.toFixed(1)}%`);
        console.log(`- Zero: ${currentStats.long_term.dozens.zero.percentage.toFixed(1)}%`);
        
        // Zona zero
        console.log('\nZona Zero:');
        console.log(`- Ultimi 50 spin: ${currentStats.short_term.zeroNeighbors.total.percentage.toFixed(1)}%`);
        console.log(`- Ultimi 500 spin: ${currentStats.long_term.zeroNeighbors.total.percentage.toFixed(1)}%`);

        // Numeri caldi e freddi
        console.log('\nNumeri caldi (ultimi 50 spin):');
        currentStats.short_term.hotNumbers
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5)
          .forEach(num => {
            console.log(`- ${num.number}: ${num.percentage.toFixed(1)}% (${num.trend})`);
          });

        console.log('\nNumeri freddi (ultimi 50 spin):');
        currentStats.short_term.coldNumbers
          .sort((a, b) => a.percentage - b.percentage)
          .slice(0, 5)
          .forEach(num => {
            console.log(`- ${num.number}: ${num.percentage.toFixed(1)}%`);
          });

        // Sequenze
        console.log('\nSequenze più probabili:');
        currentStats.short_term.sequences
          .sort((a, b) => b.successRate - a.successRate)
          .slice(0, 3)
          .forEach(seq => {
            console.log(`- ${seq.trigger} -> [${seq.followers.join(', ')}] (${seq.successRate.toFixed(1)}%)`);
          });

        // Ottieni predizione
        const prediction = await stats.getPredictions(userId);
        const recommendedNumbers = prediction.recommendedNumbers.primary;
        const confidence = stats._calculateConfidence(prediction.reasons);
        
        console.log('\nAnalisi delle previsioni:');
        prediction.reasons.forEach(reason => {
          switch(reason.type) {
            case 'dozen':
              console.log(`\nDozzina ${reason.dozen} in sofferenza (${reason.percentage.toFixed(1)}%)`);
              console.log(`Numeri consigliati: ${reason.numbers.join(', ')}`);
              break;
            case 'zeroNeighbors':
              console.log(`\nZona zero in sofferenza (${reason.percentage.toFixed(1)}%)`);
              console.log(`Numeri consigliati: ${reason.numbers.join(', ')}`);
              break;
            case 'trends':
              console.log('\nTrend identificati:');
              reason.trends.forEach(trend => {
                console.log(`- ${trend.category === 'dozen' ? `Dozzina ${trend.dozen}` : 'Zona zero'}`);
                console.log(`  Breve termine: ${trend.shortTerm.toFixed(1)}%`);
                console.log(`  Lungo termine: ${trend.longTerm.toFixed(1)}%`);
                console.log(`  Variazione: ${trend.trend > 0 ? '+' : ''}${trend.trend.toFixed(1)}%`);
                if (trend.numbers) {
                  console.log(`  Numeri interessati: ${trend.numbers.join(', ')}`);
                }
              });
              break;
            case 'correlations':
              console.log('\nCorrelazioni trovate:');
              reason.correlations.forEach(corr => {
                console.log(`- ${corr.description} (Prob: ${corr.probability.toFixed(1)}%)`);
              });
              break;
          }
        });

        console.log('\nNumeri consigliati:');
        console.log(`Primari (puntata alta): ${prediction.recommendedNumbers.primary.join(', ')}`);
        console.log(`Secondari (puntata media): ${prediction.recommendedNumbers.secondary.join(', ')}`);
        console.log(`Confidence Score: ${confidence.toFixed(1)}%`);
        
        // Simula nuovo spin
        const actualNumber = Math.floor(Math.random() * 37);
        console.log(`\nNumero uscito: ${actualNumber}`);
        await stats.addSpin(userId, actualNumber);
        
        // Verifica hit
        const isHit = recommendedNumbers.includes(actualNumber);
        const isCorrelationHit = prediction.reasons.some(reason => 
          reason.type === 'correlations' && 
          reason.correlations.some(corr => corr.numbers.includes(actualNumber))
        );

        // Aggiorna risultati
        results.predictions.push({
          recommended: recommendedNumbers,
          actual: actualNumber,
          confidence,
          hit: isHit,
          correlationHit: isCorrelationHit
        });
        
        if (isHit) results.hits++;
        if (isCorrelationHit) results.correlationHits++;
        results.confidenceScores.push(confidence);
        results.totalSpins++;

        // Log ogni 5 round
        if ((round + 1) % 5 === 0) {
          const hitRate = (results.hits / (round + 1)) * 100;
          const avgConfidence = results.confidenceScores.reduce((a, b) => a + b, 0) / results.confidenceScores.length;
          const correlationHitRate = (results.correlationHits / (round + 1)) * 100;
          
          console.log('\nRisultati parziali:');
          console.log(`Hit Rate: ${hitRate.toFixed(2)}%`);
          console.log(`Correlation Hit Rate: ${correlationHitRate.toFixed(2)}%`);
          console.log(`Average Confidence: ${avgConfidence.toFixed(2)}%`);
        }
      } catch (error) {
        console.error(`Errore nel round ${round + 1}:`, error);
      }
    }

    // Statistiche finali
    console.log('\n=== RISULTATI FINALI ===');
    console.log(`Totale Spin: ${results.totalSpins}`);
    console.log(`Hit Rate Totale: ${((results.hits / results.totalSpins) * 100).toFixed(2)}%`);
    console.log(`Hit Rate Correlazioni: ${((results.correlationHits / results.totalSpins) * 100).toFixed(2)}%`);
    console.log(`Confidence Score Medio: ${(results.confidenceScores.reduce((a, b) => a + b, 0) / results.totalSpins).toFixed(2)}%`);

  } catch (error) {
    console.error('Errore durante la simulazione:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnesso dal database');
  }
}

// Esegui la simulazione
simulateRouletteSession();
