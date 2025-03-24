const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const userRepository = require('../repositories/user.repository');

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
    // Prima verifica dal token JWT (più veloce)
    const hasValidSubscriptionInToken = req.user && 
      req.user.subscription && 
      req.user.subscription.status === 'active' &&
      new Date(req.user.subscription.endDate) > new Date();
    
    // Se il token indica che l'utente ha un abbonamento valido, procedi
    if (hasValidSubscriptionInToken) {
      return next();
    }
    
    // Se il token non indica un abbonamento valido, verifica dal database
    // Questo copre il caso in cui l'abbonamento è stato attivato dopo il login
    const user = await userRepository.findById(req.user.id);
    
    if (user && 
        user.subscription && 
        user.subscription.status === 'active' && 
        new Date(user.subscription.endDate) > new Date()) {
      // L'utente ha un abbonamento valido nel database, procedi
      return next();
    }
    
    // L'utente non ha un abbonamento valido né nel token né nel database
    return next(new AppError('This feature requires an active Premium subscription', 403));
  } catch (error) {
    console.error('Error in requirePremium middleware:', error);
    return next(new AppError('Error verifying subscription status', 500));
  }
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
