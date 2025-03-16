const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  foreignUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['bug_report', 'payment_issue', 'feature_request', 'general_inquiry', 'other'],
    required: [true, 'Category is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  }
}, {
  timestamps: true
});

// Indici
contactSchema.index({ 'foreignUserId': 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
