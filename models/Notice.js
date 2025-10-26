const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
