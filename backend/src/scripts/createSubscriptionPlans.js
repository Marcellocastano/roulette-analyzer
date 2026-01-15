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
        duration: 'unlimited',
        durationValue: null,
        price: {
          amount: 0,
          currency: 'EUR'
        },
        sessions: {
          total: 0
        },
        isActive: true,
        paymentLink: null
      },
      {
        name: 'Trial',
        type: 'trial',
        duration: 'days',
        durationValue: 3,
        price: {
          amount: 0,
          currency: 'EUR'
        },
        sessions: {
          total: 3
        },
        isActive: true,
        paymentLink: null
      },
      {
        name: 'Mensile',
        type: 'premium',
        duration: 'monthly',
        durationValue: 1,
        price: {
          amount: 9.99,
          currency: 'EUR'
        },
        sessions: {
          total: 5
        },
        isActive: true,
        paymentLink: 'https://pay.sumup.com/b2c/QPP2FGRH'
      },
      {
        name: 'Annuale',
        type: 'premium',
        duration: 'annual',
        durationValue: 1,
        price: {
          amount: 99.99,
          currency: 'EUR'
        },
        sessions: {
          total: 999999
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
