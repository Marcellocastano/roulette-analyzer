const express = require('express');
const ContactController = require('../controllers/contact.controller');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();
const contactController = new ContactController();

// Protect all routes
router.use(authenticateToken);

// Contact routes
router.post('/feedback', contactController.addFeedback);

module.exports = router;
