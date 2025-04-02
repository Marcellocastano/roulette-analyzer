const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/confirm-email/:token', authController.confirmEmail);
router.post('/resend-confirmation', authController.resendConfirmationEmail);

module.exports = router;
