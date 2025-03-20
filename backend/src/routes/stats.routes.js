const express = require('express');
const { authenticateToken, requirePremium } = require('../middlewares/auth');
const StatsController = require('../controllers/stats.controller');

const router = express.Router();
const statsController = new StatsController();

router.use(authenticateToken);

router.post('/spin', statsController.addSpin);
router.get('/spin/history', requirePremium, statsController.getSpinHistory);
router.delete('/spin/last', requirePremium, statsController.deleteSpin);
router.get('/predictions', requirePremium, statsController.getPredictions);
router.get('/reset', statsController.resetSession);

module.exports = router;
