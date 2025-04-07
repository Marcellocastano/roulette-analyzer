const path = require('path');

// Carica il file .env appropriato in base all'ambiente
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, `../../${envFile}`) });

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Impostato (non mostrato per sicurezza)' : 'Non impostato');

const config = {
  development: {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/roulette_analyzer',
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    email: {
      service: process.env.EMAIL_SERVICE || '',
      user: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASSWORD || '',
      from: process.env.EMAIL_FROM || ''
    }
  },
  production: {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN,
    frontendUrl: process.env.FRONTEND_URL,
    email: {
      service: process.env.EMAIL_SERVICE,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM,
      domain: process.env.EMAIL_DOMAIN
    }
  }
};

// Esporta la configurazione in base all'ambiente
module.exports = config[env];