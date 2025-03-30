const express = require('express');
const SubscriptionController = require('../controllers/subscription.controller');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();
const subscriptionController = new SubscriptionController();

// Tutte le rotte richiedono autenticazione
router.use(authenticateToken);

// Ottiene i dettagli dell'abbonamento attivo dell'utente
router.get('/current', subscriptionController.getUserSubscription);
// Ottiene tutte le richieste di abbonamento dell'utente
router.get('/requests', subscriptionController.getUserSubscriptionRequests);
// Ottiene la richiesta di abbonamento in attesa
router.get('/request-in-pending', subscriptionController.requestSubscriptionInPending);
// Richiede un nuovo abbonamento o il rinnovo di un abbonamento esistente
router.post('/request', subscriptionController.requestSubscription);
// Attiva un abbonamento di prova
router.post('/trial', subscriptionController.activateTrial);
// Annulla una richiesta di abbonamento pendente
router.delete('/request/:requestId', subscriptionController.cancelSubscriptionRequest);
// Verifica il limite di sessioni per un utente
router.get('/session-limit', subscriptionController.checkSessionLimit);
// Ottiene lo stato dettagliato delle sessioni dell'utente
router.get('/session-status', subscriptionController.getSessionStatus);
// Incrementa il contatore delle sessioni per un utente
router.post('/increment-session', subscriptionController.incrementSessionCount);

module.exports = router;
