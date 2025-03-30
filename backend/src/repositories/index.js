const userRepository = require('./user.repository');
const statisticsRepository = require('./statistics.repository');
const contactRepository = require('./contact.repository');
const planRepository = require('./plan.repository');
const subscriptionRepository = require('./subscription.repository');
const subscriptionRequestRepository = require('./subscription-request.repository');

module.exports = {
  userRepository,
  statisticsRepository,
  contactRepository,
  planRepository,
  subscriptionRepository,
  subscriptionRequestRepository
};
