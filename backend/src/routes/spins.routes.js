const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const SpinsController = require('../controllers/spins.controller');

const router = express.Router();
const spinsController = new SpinsController();

// Protect all routes
router.use(authenticateToken);

// Spins routes
router.post('/', spinsController.addSpin);
router.get('/recent', spinsController.getRecentSpins);
router.get('/history', spinsController.getSpinHistory);
router.delete('/:id', spinsController.deleteSpin);
router.get('/session/:sessionId', spinsController.getSessionSpins);

// Stats routes
router.get('/stats/dozens', spinsController.getDozensStats);
router.get('/stats/zero-neighbors', spinsController.getZeroNeighborsStats);

module.exports = router;
