const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  cloudinaryUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true }
}, { timestamps: true });

imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
