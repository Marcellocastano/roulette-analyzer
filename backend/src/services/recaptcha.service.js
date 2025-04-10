const axios = require('axios');
const recaptchaConfig = require('../config/recaptcha');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Servizio per la verifica del reCAPTCHA (supporta v2 e v3)
 */
class RecaptchaService {
  /**
   * Verifica il token reCAPTCHA
   * @param {string} token - Token reCAPTCHA da verificare
   * @returns {Promise<boolean>} - Risultato della verifica
   */
  async verifyToken(token) {
    // Se reCAPTCHA è disabilitato, ritorna sempre true
    if (!recaptchaConfig.enabled) {
      return true;
    }

    try {
      // Verifica il token con l'API di Google reCAPTCHA
      const url = 'https://www.google.com/recaptcha/api/siteverify';
      
      // Prepara i dati per la richiesta
      const params = new URLSearchParams();
      params.append('secret', recaptchaConfig.secretKey);
      params.append('response', token);
      
      console.log('Verifying reCAPTCHA token with secret:', recaptchaConfig.secretKey.substring(0, 5) + '...');
      console.log('Token:', token.substring(0, 10) + '...');
      
      const response = await axios.post(url, params);

      // Controlla la risposta
      if (response.data && response.data.success) {
        console.log('reCAPTCHA verification successful');
        
        // Per reCAPTCHA v3, verifica anche il punteggio
        if (response.data.score !== undefined) {
          const score = response.data.score;
          console.log(`reCAPTCHA v3 score: ${score}`);
          
          // Verifica che il punteggio sia superiore alla soglia
          if (score >= recaptchaConfig.scoreThreshold) {
            return true;
          } else {
            console.error(`reCAPTCHA v3 score too low: ${score} < ${recaptchaConfig.scoreThreshold}`);
            return false;
          }
        }
        
        return true;
      } else {
        console.error('reCAPTCHA verification failed:', 
          response.data['error-codes'] ? response.data['error-codes'].join(', ') : 'Unknown reason');
        return false;
      }
    } catch (error) {
      console.error('Error verifying reCAPTCHA token:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Middleware per verificare il token reCAPTCHA
   * @param {Object} req - Richiesta HTTP
   * @param {Object} res - Risposta HTTP
   * @param {Function} next - Funzione next
   */
  middleware = async (req, res, next) => {
    // Se reCAPTCHA è disabilitato, passa al prossimo middleware
    if (!recaptchaConfig.enabled) {
      return next();
    }

    try {
      const { recaptchaToken } = req.body;

      // Se non c'è token, lancia un errore
      if (!recaptchaToken) {
        throw new AppError('reCAPTCHA verification required', 400);
      }

      // Verifica il token
      const isValid = await this.verifyToken(recaptchaToken);

      if (!isValid) {
        throw new AppError('reCAPTCHA verification failed', 400);
      }

      // Se tutto è ok, passa al prossimo middleware
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new RecaptchaService();
