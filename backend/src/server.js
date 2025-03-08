const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');

// Connect to MongoDB and start server
mongoose.connect(config.mongoUri)
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