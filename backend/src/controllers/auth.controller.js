const { AuthService } = require('../services');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register({ email, password, name });
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      
      // Imposta il refresh token come cookie httpOnly
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 giorni
      });

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      await this.authService.logout(req.user.id);
      
      // Rimuovi il refresh token cookie
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          status: 'fail',
          message: 'No refresh token provided'
        });
        return;
      }

      const result = await this.authService.refresh(refreshToken);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to email'
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      await this.authService.resetPassword(token, password);
      
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req, res, next) => {
    try {
      const { token } = req.params;
      
      const user = await this.authService.confirmEmail(token);
      
      res.status(200).json({
        status: 'success',
        message: 'Email confirmed successfully',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  resendConfirmationEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      
      await this.authService.resendConfirmationEmail(email);
      
      res.status(200).json({
        status: 'success',
        message: 'Confirmation email resent successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
