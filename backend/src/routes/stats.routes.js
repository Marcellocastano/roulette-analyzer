const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const StatsController = require('../controllers/stats.controller');

const router = express.Router();
const statsController = new StatsController();

// Protect all routes
router.use(authenticateToken);

// Stats routes
router.post('/spin', statsController.addSpin);
router.get('/predictions', statsController.getPredictions);
router.get('/reset', statsController.resetSession);

module.exports = router;
