const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const StatsController = require('../controllers/stats.controller');

const router = express.Router();
const statsController = new StatsController();

// Protect all routes
router.use(authenticateToken);

// Stats routes
router.get('/dozens', statsController.getDozensStats);
router.get('/zero-neighbors', statsController.getZeroNeighborsStats);
router.get('/hot-numbers', statsController.getHotNumbers);
router.get('/cold-numbers', statsController.getColdNumbers);
router.get('/predictions', statsController.getPredictions);

module.exports = router;
