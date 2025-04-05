require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/plan.model');

async function createSubscriptionPlans() {
  try {
    // Connessione al database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roulette_analyzer');
    console.log('Connected to MongoDB');

    // Elimina i piani esistenti (opzionale, rimuovi questa parte se vuoi mantenere i piani esistenti)
    await Plan.deleteMany({});
    console.log('Existing plans deleted');

    // Crea i piani
    const plans = [
      {
        name: 'Free',
        type: 'free',
        duration: {
          type: 'unlimited',
          value: null
        },
        price: {
          amount: 0,
          currency: 'EUR'
        },
        rules: {
          sessions: 0,
          spins: 0
        },
        isActive: true,
        paymentLink: null
      },
      {
        name: 'Trial',
        type: 'trial',
        duration: {
          type: 'days',
          value: 7,
        },
        price: {
          amount: 0,
          currency: 'EUR'
        },
        rules: {
          sessions: 1,
          spins: 30,
          prediction: 'base'
        },
        isActive: true,
        paymentLink: null
      },
      {
        name: 'Starter',
        type: 'premium',
        duration: {
          type: 'monthly',
          value: 1
        },
        price: {
          amount: 49,
          currency: 'EUR'
        },
        rules: {
          sessions: 5,
          spins: 200,
          prediction: 'base'
        },
        isActive: true,
        paymentLink: 'https://pay.sumup.com/b2c/QPP2FGRH'
      },
      {
        name: 'Pro',
        type: 'premium',
        duration: {
          type: 'monthly',
          value: 1
        },
        price: {
          amount: 99,
          currency: 'EUR'
        },
        rules: {
          sessions: -1,
          spins: -1,
          prediction: 'full'
        },
        isActive: true,
        paymentLink: 'https://pay.sumup.com/b2c/QIIEJQIO'
      },
      {
        name: 'Starter Annual',
        type: 'premium',
        duration: {
          type: 'annual',
          value: 1
        },
        price: {
          amount: 299,
          currency: 'EUR'
        },
        rules: {
          sessions: 5,
          spins: 200,
          prediction: 'base'
        },
        isActive: true,
        paymentLink: 'https://pay.sumup.com/b2c/QPP2FGRH'
      },
      {
        name: 'Pro Annual',
        type: 'premium',
        duration: {
          type: 'annual',
          value: 1
        },
        price: {
          amount: 599,
          currency: 'EUR'
        },
        rules: {
          sessions: -1,
          spins: -1,
          prediction: 'full'
        },
        isActive: true,
        paymentLink: 'https://pay.sumup.com/b2c/QIIEJQIO'
      }
    ];

    // Salva i piani nel database
    for (const planData of plans) {
      const plan = new Plan(planData);
      await plan.save();
      console.log(`Piano "${planData.name}" creato con successo`);
    }

    console.log('Creazione dei piani di abbonamento completata');
    process.exit(0);
  } catch (error) {
    console.error('Errore durante la creazione dei piani:', error);
    process.exit(1);
  }
}

// Esegui la funzione
createSubscriptionPlans();
