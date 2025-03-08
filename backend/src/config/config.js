const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

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
    corsOrigin: process.env.CORS_ORIGIN || 'https://tuodominio.com'
  }
};

// Esporta la configurazione in base all'ambiente
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];