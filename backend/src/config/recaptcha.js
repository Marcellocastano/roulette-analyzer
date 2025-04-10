/**
 * Configurazione per Google reCAPTCHA v3
 */
module.exports = {
  siteKey: process.env.RECAPTCHA_SITE_KEY,
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  enabled: process.env.RECAPTCHA_ENABLED === 'true' || true,
  // Soglia minima di punteggio per reCAPTCHA v3 (0.0 - 1.0)
  scoreThreshold: 0.5
};
