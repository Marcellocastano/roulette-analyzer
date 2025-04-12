const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const isAdmin = (req, res, next) => {
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
  });

  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Accesso negato. Richiesto ruolo admin', 403);
  }
  next();
};

module.exports = isAdmin;
