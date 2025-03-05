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

  changePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      
      // Validazione dei dati di input
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Sia la vecchia che la nuova password sono richieste'
        });
      }

      const result = await this.userService.changePassword(
        req.user.id,
        oldPassword,
        newPassword
      );
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  requestSubscription = async (req, res, next) => {
    try {
      const { plan, duration } = req.body;
      
      // Validazione dei dati di input
      if (!plan || !duration) {
        return res.status(400).json({
          status: 'error',
          message: 'Piano e durata sono richiesti'
        });
      }
      
      // Verifica che il piano e la durata siano validi
      if (!['premium'].includes(plan)) {
        return res.status(400).json({
          status: 'error',
          message: 'Piano non valido'
        });
      }
      
      if (!['monthly', 'annual'].includes(duration)) {
        return res.status(400).json({
          status: 'error',
          message: 'Durata non valida'
        });
      }
      
      const subscription = await this.userService.requestSubscription(
        req.user.id,
        plan,
        duration
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Richiesta di sottoscrizione inviata con successo',
        data: {
          subscription,
          paymentInstructions: {
            paypalEmail: 'pagamenti@roulette-destroyer.com',
            reference: `SUB-${req.user.id}-${Date.now()}`,
            amount: duration === 'monthly' ? '50' : '300',
            currency: 'EUR'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  cancelSubscriptionRequest = async (req, res, next) => {
    try {
      const result = await this.userService.cancelSubscriptionRequest(req.user.id);
      
      res.status(200).json({
        status: 'success',
        message: 'Richiesta di sottoscrizione annullata con successo',
        data: {
          subscription: result
        }
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
