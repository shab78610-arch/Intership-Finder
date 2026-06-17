const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide internship title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide internship description'],
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true,
  },
  stipend: {
    type: Number,
    required: [true, 'Please provide stipend amount'],
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Internship', InternshipSchema);