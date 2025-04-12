const app = require('./app.js');
const mongoose = require('mongoose');
const config = require('./config/config');
const { SchedulerService } = require('./services');

// Opzioni di connessione MongoDB ottimizzate
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000
};

// Funzione per connettere a MongoDB
const connectWithRetry = () => {
    mongoose.connect(config.mongoUri, mongooseOptions)
        .then(() => {
            console.log('Connesso a MongoDB');
            startServer();
        })
        .catch(err => {
            console.error('Errore di connessione MongoDB:', err);
            console.log('Nuovo tentativo tra 5 secondi...');
            setTimeout(connectWithRetry, 5000);
        });
};

// Funzione per avviare il server
const startServer = () => {
    // Aggiungi log per ogni richiesta HTTP
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`);
      });
      next();
    });

    app.listen(config.port, () => {
        console.log(`Server avviato in modalità ${process.env.NODE_ENV || 'development'} sulla porta ${config.port}`);
        console.log(`Configurazione email: servizio=${config.email.service}, utente=${config.email.user}`);
        console.log(`CORS configurato per: ${config.corsOrigin}`);
        console.log(`Frontend URL: ${config.frontendUrl}`);
        
        // Inizializza il servizio di scheduler
        SchedulerService.initialize();
    });
};

// Gestione degli eventi di connessione MongoDB
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnesso. Tentativo di riconnessione...');
    if (process.env.NODE_ENV !== 'production') {
        // In ambiente di sviluppo, tenta di riconnettersi
        setTimeout(connectWithRetry, 5000);
    }
});

mongoose.connection.on('error', (err) => {
    console.error('Errore di connessione MongoDB:', err);
    if (err.name === 'MongoNetworkError') {
        console.log('Errore di rete MongoDB. Tentativo di riconnessione...');
        setTimeout(connectWithRetry, 5000);
    }
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB riconnesso con successo');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Connessione MongoDB chiusa correttamente');
        process.exit(0);
    } catch (err) {
        console.error('Errore durante la chiusura della connessione MongoDB:', err);
        process.exit(1);
    }
});

// Avvia la connessione
connectWithRetry();