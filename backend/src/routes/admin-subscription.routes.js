const express = require('express');
const AdminSubscriptionController = require('../controllers/admin-subscription.controller');
const { authenticateToken } = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();
const adminSubscriptionController = new AdminSubscriptionController();

// Tutte le rotte richiedono autenticazione e privilegi di amministratore
router.use(authenticateToken);
router.use(isAdmin);

// Ottiene tutte le richieste di abbonamento in attesa
router.get('/requests/pending', adminSubscriptionController.getPendingSubscriptionRequests);

// Attiva un abbonamento in base a una richiesta
router.post('/activate/:requestId', adminSubscriptionController.activateSubscription);

// Rifiuta una richiesta di abbonamento
router.post('/reject/:requestId', adminSubscriptionController.rejectSubscriptionRequest);

// Disattiva un abbonamento attivo
router.post('/deactivate/:subscriptionId', adminSubscriptionController.deactivateSubscription);

module.exports = router;
