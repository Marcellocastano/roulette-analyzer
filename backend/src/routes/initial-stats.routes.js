const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const InitialStatsController = require('../controllers/initial-stats.controller');

const router = express.Router();
const initialStatsController = new InitialStatsController();

// Protect all routes
router.use(authenticateToken);

router.post('/add', initialStatsController.addInitialStats);
router.get('/latest', initialStatsController.getLatestStats);

module.exports = router;
