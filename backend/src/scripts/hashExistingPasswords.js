require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function hashExistingPasswords() {
    try {
        // Connessione al database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roulette_analyzer');
        console.log('Connected to MongoDB');

        // Trova tutti gli utenti
        const users = await User.find().select('+password');
        console.log(`Found ${users.length} users`);

        // Aggiorna le password
        for (const user of users) {
            // Verifica se la password sembra già essere hashata (controlla la lunghezza)
            if (user.password && user.password.length < 30) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                console.log(`Updated password for user: ${user.email}`);
            }
        }

        console.log('Password migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Error during password migration:', error);
        process.exit(1);
    }
}

hashExistingPasswords();
