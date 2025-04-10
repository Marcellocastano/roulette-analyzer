const express = require('express');
const ContactController = require('../controllers/contact.controller');
const { authenticateToken } = require('../middlewares/auth');
const { RecaptchaService } = require('../services');

const router = express.Router();
const contactController = new ContactController();

// Protect all routes
router.use(authenticateToken);

// Contact routes
router.post('/feedback', RecaptchaService.middleware, contactController.addFeedback);

module.exports = router;
