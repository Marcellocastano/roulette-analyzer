const express = require('express');
const NotificationSettingsController = require('../controllers/notification-settings.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth');

const router = express.Router();
const notificationSettingsController = new NotificationSettingsController();

// Tutte le route richiedono autenticazione come admin
router.use(authenticateToken);
router.use(checkRole(['admin']));

// GET /api/notification-settings - Ottiene le impostazioni di notifica
router.get('/', notificationSettingsController.getSettings);

// GET /api/notification-settings/status - Ottiene lo stato delle notifiche
router.get('/status', notificationSettingsController.getNotificationStatus);

// PUT /api/notification-settings - Aggiorna le impostazioni di notifica
router.put('/', notificationSettingsController.updateSettings);

// PUT /api/notification-settings/signup - Abilita/disabilita notifiche di registrazione
router.put('/signup', notificationSettingsController.toggleSignupNotifications);

// PUT /api/notification-settings/payment-requests - Abilita/disabilita notifiche di richiesta pagamento
router.put('/payment-requests', notificationSettingsController.togglePaymentRequestNotifications);

// PUT /api/notification-settings/admin-email - Aggiorna email amministratore
router.put('/admin-email', notificationSettingsController.updateAdminEmail);

module.exports = router;
