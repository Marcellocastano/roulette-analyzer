const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.get('/users/:userId/request/pending', adminController.getUserRequestPending);
router.post('/users/:userId/activate-subscription', adminController.activateSubscription);
router.post('/users/:userId/deactivate-subscription', adminController.deactivateSubscription);

module.exports = router;