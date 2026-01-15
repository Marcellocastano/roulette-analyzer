const mongoose = require('mongoose');

const initialStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  active: { type: Boolean, default: true },
  inputMode: {
    type: String,
    enum: ['normal', 'advanced'],
    default: 'normal'
  },
  stats50: {
    zeroNeighbors: {
      percentage: { type: Number, default: 0 }
    }
  },
  stats500: {
    dozens: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
    },
    zeroNeighbors: {
      percentage: { type: Number, default: 0 }
    }
  },
  zeroZoneNumbers: [{
    number: { type: Number, required: true },
    increasePercentage: { type: Number, required: true },
  }],
  dozenDown: { type: Number, min: 1, max: 3 },  // 1, 2 o 3
  dozenUp: { type: Number, min: 1, max: 3 },  // 1, 2 o 3
  analysis: {
    tableStatus: {
      type: String,
      enum: ['recommended', 'borderline', 'not_recommended'],
      default: 'recommended'
    },
    reasonCodes: [{ type: String }],
    increasingNumbers: [{ type: Number }]
  }
});

module.exports = mongoose.model('InitialStats', initialStatsSchema);
