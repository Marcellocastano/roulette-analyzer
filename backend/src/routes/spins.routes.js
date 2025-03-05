const express = require('express');
const { authenticateToken, requirePremium } = require('../middlewares/auth');
const SpinsController = require('../controllers/spins.controller');

const router = express.Router();
const spinsController = new SpinsController();

// Protect all routes
router.use(authenticateToken);

// Spins routes di base (accessibili a tutti gli utenti autenticati)
router.post('/', requirePremium, spinsController.addSpin);
router.get('/recent', requirePremium, spinsController.getRecentSpins);
router.get('/history', requirePremium, spinsController.getSpinHistory);
router.delete('/:id', requirePremium, spinsController.deleteSpin);
router.get('/session/:sessionId', requirePremium, spinsController.getSessionSpins);

// Stats routes avanzate (richiedono abbonamento premium)
router.get('/stats/dozens', requirePremium, spinsController.getDozensStats);
router.get('/stats/zero-neighbors', requirePremium, spinsController.getZeroNeighborsStats);

module.exports = router;
