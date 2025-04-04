const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const UserController = require('../controllers/user.controller');

const router = express.Router();
const userController = new UserController();

// Protect all routes
router.use(authenticateToken);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/subscription', userController.getSubscription);
router.post('/subscription/trial', userController.activateTrial);
router.post('/change-password', userController.changePassword);
router.post('/subscription/request', userController.requestSubscription);
router.post('/subscription/cancel', userController.cancelSubscriptionRequest);
// router.post('/subscribe', userController.subscribe);

module.exports = router;
