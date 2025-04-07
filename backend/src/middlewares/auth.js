const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const userRepository = require('../repositories/user.repository');
const subscriptionRepository = require('../repositories/subscription.repository');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new AppError('Invalid token', 403));
    }
    req.user = user;
    next();
  });
};

const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized - Insufficient role', 403));
    }
    next();
  };
};

/**
 * Middleware che verifica se l'utente ha un abbonamento premium attivo
 * Blocca l'accesso alle risorse premium se l'utente non ha un abbonamento valido
 */
const requirePremium = async (req, res, next) => {
  try {
    const userSubscription = await subscriptionRepository.findById(req.user.activeSubscription);
    console.log('User subscription:', userSubscription, req.user);
    const hasValidSubscriptionInToken = req.user && 
      req.user.activeSubscription &&
      userSubscription.status === 'active' &&
      (userSubscription.endDate ? new Date(userSubscription.endDate) > new Date() : true);
    
    if (hasValidSubscriptionInToken) {
      return next();
    }
    
    return next(new AppError('This feature requires an active Premium subscription', 403));
  } catch (error) {
    return next(new AppError('Error checking subscription status', 500));
  }
};

module.exports = {
  authenticateToken,
  checkRole,
  requirePremium
};
