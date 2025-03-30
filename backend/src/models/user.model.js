const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Non include la password nelle query di default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isTrialUsed: {
    type: Boolean,
    default: false
  },
  activeSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  lastLogin: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true
});

// Indici
userSchema.index({ 'subscription.endDate': 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metodo per verificare la password
userSchema.methods.verifyPassword = async function(candidatePassword) {
  try {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Metodo per verificare se l'abbonamento è attivo
userSchema.methods.hasActiveSubscription = function() {
  if (this.subscription.plan === 'free') return true;
  
  return (
    this.subscription.status === 'active' &&
    this.subscription.endDate > new Date()
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
