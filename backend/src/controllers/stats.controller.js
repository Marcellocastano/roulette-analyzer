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

  getDozensStats = async (req, res, next) => {
    try {
      const stats = await this.statsService.getDozensStats(req.user.id);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  getZeroNeighborsStats = async (req, res, next) => {
    try {
      const stats = await this.statsService.getZeroNeighborsStats(req.user.id);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  getHotNumbers = async (req, res, next) => {
    try {
      const hotNumbers = await this.statsService.getHotNumbers(req.user.id);
      res.status(200).json({
        status: 'success',
        data: hotNumbers
      });
    } catch (error) {
      next(error);
    }
  };

  getColdNumbers = async (req, res, next) => {
    try {
      const coldNumbers = await this.statsService.getColdNumbers(req.user.id);
      res.status(200).json({
        status: 'success',
        data: coldNumbers
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
}

module.exports = StatsController;
