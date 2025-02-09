const { UserService } = require('../services');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req, res, next) => {
    try {
      const profile = await this.userService.getProfile(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const updatedProfile = await this.userService.updateProfile(
        req.user.id,
        req.body
      );
      
      res.status(200).json({
        status: 'success',
        data: updatedProfile
      });
    } catch (error) {
      next(error);
    }
  };

  getSubscription = async (req, res, next) => {
    try {
      const subscription = await this.userService.getSubscription(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  };

//   subscribe = async (req, res, next) => {
//     try {
//       const { plan } = req.body;
//       const subscription = await this.userService.subscribe(req.user.id, plan);
      
//       res.status(200).json({
//         status: 'success',
//         data: subscription
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
}

module.exports = UserController;
