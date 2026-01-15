const express = require('express');
const { authenticateToken, requirePremium } = require('../middlewares/auth');
const InitialStatsController = require('../controllers/initial-stats.controller');

const router = express.Router();
const initialStatsController = new InitialStatsController();

// Protect all routes
router.use(authenticateToken);

// Le statistiche iniziali richiedono un abbonamento premium
router.post('/add', requirePremium, initialStatsController.addInitialStats);
router.post('/add-advanced', requirePremium, initialStatsController.addInitialStatsAdvanced);
router.get('/latest', requirePremium, initialStatsController.getLatestStats);

module.exports = router;
