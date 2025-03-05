const express = require('express');
const { authenticateToken, requirePremium } = require('../middlewares/auth');
const StatsController = require('../controllers/stats.controller');

const router = express.Router();
const statsController = new StatsController();

// Protect all routes
router.use(authenticateToken);

// Stats routes
router.post('/spin', statsController.addSpin);

// Le rotte per le previsioni richiedono un abbonamento premium
router.get('/predictions', requirePremium, statsController.getPredictions);
router.get('/reset', statsController.resetSession);

module.exports = router;
