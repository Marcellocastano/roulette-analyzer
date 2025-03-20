const StatsService = require('../services/stats.service');

class StatsController {
  constructor() {
    this.statsService = StatsService;
  }

  addSpin = async (req, res, next) => {
    try {
      const { number } = req.body;
      const stats = await this.statsService.addSpin(req.user.id, number);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  getPredictions = async (req, res, next) => {
    try {
      const predictions = await this.statsService.getPredictions(req.user.id);
      res.status(200).json({
        status: 'success',
        data: predictions
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  resetSession = async (req, res, next) => {
    try {
      const result = await this.statsService.resetSession(req.user.id);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getSpinHistory = async (req, res, next) => {
    try {
      const spins = await this.statsService.getSpinHistory(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: spins
      });
    } catch (error) {
      next(error);
    }
  };
  
  deleteSpin = async (req, res, next) => {
    try {
      const result = await this.statsService.deleteSpin(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = StatsController;
