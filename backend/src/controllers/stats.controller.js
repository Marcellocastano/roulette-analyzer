const { StatsService } = require('../services');

class StatsController {
  constructor() {
    this.statsService = StatsService;
  }

  getDozensStats = async (req, res, next) => {
    try {
      const stats = await StatsService.getDozensStats(req.user.id);
      
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
      const stats = await StatsService.getZeroNeighborsStats(req.user.id);
      
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
      const hotNumbers = await StatsService.getHotNumbers(req.user.id);
      
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
      const coldNumbers = await StatsService.getColdNumbers(req.user.id);
      
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
      const predictions = await StatsService.getPredictions(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: predictions
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = StatsController;
