const { SpinsService } = require('../services');

class SpinsController {
  constructor() {
    this.spinsService = SpinsService;
  }

  addSpin = async (req, res, next) => {
    try {
      const { number } = req.body;
      const userId = req.user.id;
      const sessionId = req.session?.id || `session_${Date.now()}`;

      const spin = await SpinsService.addSpin(userId, { number, sessionId });
      
      res.status(201).json({
        status: 'success',
        data: spin
      });
    } catch (error) {
      next(error);
    }
  };

  getRecentSpins = async (req, res, next) => {
    try {
      const spins = await SpinsService.getRecentSpins(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: spins
      });
    } catch (error) {
      next(error);
    }
  };

  getSpinHistory = async (req, res, next) => {
    try {
      const spins = await SpinsService.getSpinHistory(req.user.id);
      
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
      const { id } = req.params;
      await SpinsService.deleteSpin(req.user.id, id);
      
      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };

  getSessionSpins = async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const spins = await SpinsService.getSessionSpins(req.user.id, sessionId);
      
      res.status(200).json({
        status: 'success',
        data: spins
      });
    } catch (error) {
      next(error);
    }
  };

  getDozensStats = async (req, res, next) => {
    try {
      const stats = await SpinsService.getDozensStats(req.user.id);
      
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
      const stats = await SpinsService.getZeroNeighborsStats(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SpinsController;
