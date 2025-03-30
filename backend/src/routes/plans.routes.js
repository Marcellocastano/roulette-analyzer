const express = require('express');
const PlanController = require('../controllers/plan.controller.js');

const router = express.Router();
const planController = new PlanController();

// Ottiene tutti i piani disponibili
router.get('/', planController.getPlans);

module.exports = router;
