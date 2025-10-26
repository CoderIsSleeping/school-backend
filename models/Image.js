const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  cloudinaryUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
