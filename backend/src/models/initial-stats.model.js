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
  stats50: {
    zeroNeighbors: {
      percentage: { type: Number, required: true }
    }
  },
  stats500: {
    dozens: {
      first: { type: Number, required: true },
      second: { type: Number, required: true },
      third: { type: Number, required: true },
    },
    zeroNeighbors: {
      percentage: { type: Number, required: true }
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
      required: true
    },
    reasonCodes: [{ type: String }],
    increasingNumbers: [{ type: Number }]
  }
});

module.exports = mongoose.model('InitialStats', initialStatsSchema);
