const express = require('express');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./auth.routes');
const spinsRoutes = require('./spins.routes');
const statsRoutes = require('./stats.routes');
const userRoutes = require('./user.routes');
const initialStatsRoutes = require('./initial-stats.routes');
const adminRoutes = require('./admin.routes');
const { errorHandler } = require('../middlewares/errorHandler');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
router.use(limiter);

// API Routes
router.use('/auth', authRoutes);
router.use('/initial-stats', initialStatsRoutes);
router.use('/stats', statsRoutes);
router.use('/spins', spinsRoutes);
router.use('/users', userRoutes);
router.use('/admin', isAdmin, adminRoutes);

// Error handling
router.use(errorHandler);

module.exports = router;
