const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();
const config = require('./config/config');
const path = require('path');

const app = express();

// Configurazione per fidarsi dei proxy (necessario per Render e altri servizi cloud)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint per Render (a livello root)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Health check endpoint per Render con prefisso /api (come configurato su Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/v1', routes);

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Roulette Pro API' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
