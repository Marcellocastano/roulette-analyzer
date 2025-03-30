const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../middlewares/errorHandler');
const { userRepository, planRepository } = require('../repositories');
const emailService = require('./email.service');

class AuthService {
  async register({ email, password, name }) {
    try {
      // Verifica se l'utente esiste già
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }

      // Trova il piano gratuito
      const freePlan = await planRepository.findByType('free');
      if (!freePlan) {
        throw new AppError('Free plan not found', 500);
      }

      // Crea il nuovo utente
      const user = await userRepository.create({
        email,
        password,
        name,
        isTrialUsed: false,
        activeSubscription: null
      });

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        activeSubscription: user.activeSubscription,
        isTrialUsed: user.isTrialUsed
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in registration process', 500);
    }
  }

  async login({ email, password }) {
    try {
      // Trova l'utente e includi il campo password
      const user = await userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verifica la password
      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Aggiorna l'ultimo accesso
      await userRepository.updateLastLogin(user._id);

      // Genera i token
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
      // In una implementazione più completa, qui potremmo invalidare il refresh token
      // salvandolo in una blacklist
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

      // Genera token di reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Salva il token nel database con scadenza di 4 ore
      await userRepository.setPasswordResetToken(
        email,
        hashedToken,
        new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 ore di validità
      );

      // Invia email con il token
      try {
        await emailService.sendPasswordResetEmail(user, resetToken);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        
        // In ambiente di sviluppo, mostra il token nella console per facilitare i test
        if (process.env.NODE_ENV !== 'production') {
          console.log('=========================================');
          console.log(`Reset token for ${email}: ${resetToken}`);
          console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`);
          console.log('=========================================');
          
          throw new AppError('Failed to send password reset email, but token was generated. Check server logs for token (only in development).', 500);
        } else {
          // In produzione, restituisci un messaggio generico ma non un errore
          // Il token è stato generato e salvato, quindi l'utente può comunque resettare la password
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

      // Hash della nuova password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Aggiorna la password e rimuovi il token
      await userRepository.updatePassword(user._id, hashedPassword);

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error in password reset process', 500);
    }
  }

  generateAccessToken(user) {
    console.log('userrrrr', user)
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
