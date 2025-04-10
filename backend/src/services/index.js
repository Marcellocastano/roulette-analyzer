const AuthService = require('./auth.service');
const StatsService = require('./stats.service');
const UserService = require('./user.service');
const InitialStatsService = require('./initial-stats.service');
const AdminService = require('./admin.service');
const ContactService = require('./contact.service');
const SubscriptionService = require('./subscription.service');
const PredictionService = require('./prediction.service');
const EmailService = require('./email.service');
const PlanService = require('./plan.service');
const RecaptchaService = require('./recaptcha.service');

module.exports = {
    AuthService,
    StatsService,
    UserService,
    InitialStatsService,
    AdminService,
    ContactService,
    SubscriptionService,
    PredictionService,
    EmailService,
    PlanService,
    RecaptchaService
};
