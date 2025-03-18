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
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  production: {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || 'https://roulette-analyzer.onrender.com'
  }
};

// Esporta la configurazione in base all'ambiente
module.exports = config[env];