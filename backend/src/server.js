const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');

// Connect to MongoDB and start server
mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000
})
    .then(() => {
        console.log('Connesso a MongoDB');
        app.listen(config.port, () => {
            console.log(`Server avviato in modalità ${process.env.NODE_ENV || 'development'} sulla porta ${config.port}`);
        });
    })
    .catch(err => {
        console.error('Errore di connessione MongoDB:', err);
        process.exit(1);
    });

// Gestione degli eventi di connessione MongoDB
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnesso. Tentativo di riconnessione...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB riconnesso con successo');
});

mongoose.connection.on('error', (err) => {
    console.error('Errore di connessione MongoDB:', err);
    if (err.name === 'MongoNetworkError') {
        console.log('Errore di rete MongoDB. Tentativo di riconnessione...');
    }
});