const cloudinary = require('cloudinary').v2;
const Image = require('../models/Image');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const file = req.files.image;

    // Upload to Cloudinary with compression
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'gallery',
      quality: 'auto:good', // Automatic quality optimization
      fetch_format: 'auto', // Automatic format selection
      transformation: [
        { width: 1200, crop: 'limit' }, // Max width 1200px
        { quality: '80' } // 80% quality
      ]
    });

    // Save to MongoDB
    const newImage = new Image({
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    await newImage.save();

    res.json({
      success: true,
      url: result.secure_url,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};
