const { AppError } = require('../middlewares/errorHandler');
const adminService = require('../services/admin.service');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const user = await adminService.getUserDetails(req.params.userId);
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async activateSubscription(req, res, next) {
    try {
      const subscription = await adminService.activateSubscription(req.params.userId);
      res.status(200).json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateSubscription(req, res, next) {
    try {
      const subscription = await adminService.deactivateSubscription(req.params.userId);
      res.status(200).json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRequestPending(req, res, next) {
    try {
        const requests = await adminService.getUserRequestPending(req.params.userId);
        res.status(200).json({
            status: 'success',
            data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      
      const user = await adminService.updateUserStatus(userId, status);
      
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();