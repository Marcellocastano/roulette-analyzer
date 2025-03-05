const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

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
const requirePremium = (req, res, next) => {
  // Verifica se l'utente esiste e ha un abbonamento premium attivo
  if (!req.user || 
      !req.user.subscription || 
      req.user.subscription.plan !== 'premium' || 
      req.user.subscription.status !== 'active' ||
      new Date(req.user.subscription.endDate) <= new Date()) {
    return next(new AppError('This feature requires an active Premium subscription', 403));
  }
  
  next();
};

// Manteniamo il vecchio middleware per retrocompatibilità
const checkSubscription = (req, res, next) => {
  if (!req.user.subscription || req.user.subscription === 'free') {
    if (req.originalUrl.includes('/premium')) {
      return next(new AppError('Premium subscription required', 403));
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  checkRole,
  checkSubscription,
  requirePremium
};
