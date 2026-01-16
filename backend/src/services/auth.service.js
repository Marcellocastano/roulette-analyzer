const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../middlewares/errorHandler');
const { userRepository, planRepository } = require('../repositories');
const emailService = require('./email.service');

class AuthService {
  async register({ email, password, name }) {
    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }

      const user = await userRepository.create({
        email,
        password,
        name,
        role: 'user',
        active: false
      });

      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(confirmationToken)
        .digest('hex');

      await userRepository.setEmailConfirmationToken(
        email,
        hashedToken,
        new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ore di validità
      );

      try {
        await emailService.sendConfirmationEmail(user, confirmationToken);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('=========================================');
          console.log(`Confirmation token for ${email}: ${confirmationToken}`);
          console.log(`Confirmation URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-email/${confirmationToken}`);
          console.log('=========================================');
        }
      }

      // Invia notifica di registrazione all'amministratore
      try {
        await emailService.sendSignupNotificationToAdmin(user);
      } catch (notificationError) {
        console.error('Error sending signup notification to admin:', notificationError);
        // Non bloccare la registrazione se la notifica fallisce
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error during registration', 500);
    }
  }

  async login({ email, password }) {
    try {
      const user = await userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      if (!user.active) {
        throw new AppError('account_not_activated', 403);
      }

      await userRepository.updateLastLogin(user._id);

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          activeSubscription: user.activeSubscription,
          isTrialUsed: user.isTrialUsed
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error during login', 500);
    }
  }

  async logout(userId) {
    try {
      return true;
    } catch (error) {
      throw new AppError('Error during logout', 500);
    }
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      const accessToken = this.generateAccessToken(user);

      return {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          subscription: user.subscription
        }
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async forgotPassword(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AppError('No user found with this email', 404);
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await userRepository.setPasswordResetToken(
        email,
        hashedToken,
        new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 ore di validità
      );

      try {
        await emailService.sendPasswordResetEmail(user, resetToken);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('=========================================');
          console.log(`Reset token for ${email}: ${resetToken}`);
          console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`);
          console.log('=========================================');
          
          throw new AppError('Failed to send password reset email, but token was generated. Check server logs for token (only in development).', 500);
        } else {
          console.log(`Password reset token generated for ${email} but email sending failed`);
          return true;
        }
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in password reset process', 500);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await userRepository.findByResetToken(hashedToken);
      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      await userRepository.updatePassword(user._id, hashedPassword);

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in password reset process', 500);
    }
  }

  async confirmEmail(token) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await userRepository.findByEmailConfirmationToken(hashedToken);
      if (!user) {
        throw new AppError('Invalid or expired confirmation token', 400);
      }

      // Attiva l'account dell'utente
      await userRepository.activateAccount(user._id);

      return {
        id: user._id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in email confirmation process', 500);
    }
  }

  async resendConfirmationEmail(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AppError('No user found with this email', 404);
      }

      if (user.active) {
        throw new AppError('This account is already activated', 400);
      }

      // Genera token di conferma email
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(confirmationToken)
        .digest('hex');

      // Salva il token nel database con scadenza di 24 ore
      await userRepository.setEmailConfirmationToken(
        email,
        hashedToken,
        new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ore di validità
      );

      // Invia email di conferma
      try {
        await emailService.sendConfirmationEmail(user, confirmationToken);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        
        // In ambiente di sviluppo, mostra il token nella console per facilitare i test
        if (process.env.NODE_ENV !== 'production') {
          console.log('=========================================');
          console.log(`Confirmation token for ${email}: ${confirmationToken}`);
          console.log(`Confirmation URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-email/${confirmationToken}`);
          console.log('=========================================');
          
          throw new AppError('Failed to send confirmation email, but token was generated. Check server logs for token (only in development).', 500);
        } else {
          // In produzione, restituisci un messaggio generico ma non un errore
          console.log(`Confirmation token generated for ${email} but email sending failed`);
          return true;
        }
      }

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in resending confirmation email', 500);
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role,
        activeSubscription: user.activeSubscription,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = AuthService;
