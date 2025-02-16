const mongoose = require('mongoose');

const spinSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Spin number is required'],
    min: [0, 'Number must be between 0 and 36'],
    max: [36, 'Number must be between 0 and 36']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required']
  },
  metadata: {
    dozen: {
      type: String,
      enum: ['first', 'second', 'third'],
      required: true
    },
    isZeroNeighbor: {
      type: Boolean,
      required: true
    },
    color: {
      type: String,
      enum: ['red', 'black', 'green'],
      required: true
    },
    isEven: {
      type: Boolean,
      required: true
    }
  }
}, {
  timestamps: true
});

// Indici ottimizzati per le query più comuni
spinSchema.index({ user: 1, createdAt: -1 }); // Per recuperare gli ultimi spin e la cronologia
spinSchema.index({ sessionId: 1, user: 1 }); // Per recuperare gli spin di una sessione
spinSchema.index({ 'metadata.dozen': 1, user: 1, createdAt: -1 }); // Per statistiche sulle dozzine
spinSchema.index({ number: 1, user: 1, createdAt: -1 }); // Per statistiche sui numeri e hot/cold

// Middleware pre-save per calcolare i metadati
spinSchema.pre('save', function(next) {
  // Calcola la dozzina
  if (this.number <= 12 && this.number !== 0) {
    this.metadata.dozen = 'first';
  } else if (this.number <= 24) {
    this.metadata.dozen = 'second';
  } else {
    this.metadata.dozen = 'third';
  }

  // Calcola se è vicino allo zero
  const zeroNeighbors = [0, 3, 15, 12, 35, 26];
  this.metadata.isZeroNeighbor = zeroNeighbors.includes(this.number);

  // Calcola il colore
  if (this.number === 0) {
    this.metadata.color = 'green';
  } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(this.number)) {
    this.metadata.color = 'red';
  } else {
    this.metadata.color = 'black';
  }

  // Calcola se è pari
  this.metadata.isEven = this.number !== 0 && this.number % 2 === 0;

  next();
});

// Metodo statico per ottenere gli ultimi N spin di un utente
spinSchema.statics.getLastNSpins = async function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');
};

// Metodo statico per ottenere le statistiche di base
spinSchema.statics.getBasicStats = async function(userId) {
  const pipeline = [
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSpins: { $sum: 1 },
        redCount: { $sum: { $cond: [{ $eq: ['$metadata.color', 'red'] }, 1, 0] } },
        blackCount: { $sum: { $cond: [{ $eq: ['$metadata.color', 'black'] }, 1, 0] } },
        zeroCount: { $sum: { $cond: [{ $eq: ['$number', 0] }, 1, 0] } },
        evenCount: { $sum: { $cond: ['$metadata.isEven', 1, 0] } },
        oddCount: { $sum: { $cond: [{ $not: '$metadata.isEven' }, 1, 0] } }
      }
    }
  ];

  const stats = await this.aggregate(pipeline);
  return stats[0] || {
    totalSpins: 0,
    redCount: 0,
    blackCount: 0,
    zeroCount: 0,
    evenCount: 0,
    oddCount: 0
  };
};

const Spin = mongoose.model('Spin', spinSchema);

module.exports = Spin;
