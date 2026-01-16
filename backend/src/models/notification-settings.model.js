const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  // Impostazioni per le notifiche di registrazione
  signupNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Impostazioni per le notifiche di richiesta pagamento
  paymentRequestNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Impostazioni per le notifiche di contatto
  contactNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Email dell'amministratore
  adminEmail: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email non valida'
    }
  },
  
  // Metadati
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware per aggiornare updatedAt
notificationSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metodo statico per ottenere le impostazioni (singleton pattern)
notificationSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  // Se non esistono impostazioni, creane di default
  if (!settings) {
    settings = await this.create({
      adminEmail: process.env.ADMIN_EMAIL || 'admin@roulettepro.ai',
      signupNotifications: { enabled: true },
      paymentRequestNotifications: { enabled: true },
      contactNotifications: { enabled: true }
    });
  }
  
  return settings;
};

// Metodo statico per aggiornare le impostazioni
notificationSettingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.getSettings();
  
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      settings[key] = updates[key];
    }
  });
  
  return await settings.save();
};

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
