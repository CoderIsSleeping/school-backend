const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  heading: { 
    type: String, 
    required: [true, 'Heading is required'],
    trim: true,
    maxlength: [200, 'Heading cannot exceed 200 characters']
  },
  details: { 
    type: String, 
    required: [true, 'Details are required'],
    trim: true,
    maxlength: [5000, 'Details cannot exceed 5000 characters']
  }
}, { timestamps: true });

noticeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
