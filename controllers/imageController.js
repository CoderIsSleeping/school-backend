const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Image = require('../models/Image');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

exports.uploadImage = async (req, res) => {
  let tempFilePath = null;

  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const file = req.files.image;
    tempFilePath = file.tempFilePath;

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' 
      });
    }

    // Upload to Cloudinary with compression
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'gallery',
      quality: 'auto:good',
      fetch_format: 'auto',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: '80' }
      ]
    });

    // Save to MongoDB
    const newImage = new Image({
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    try {
      await newImage.save();
    } catch (dbError) {
      // Rollback: delete from Cloudinary if DB save fails
      await cloudinary.uploader.destroy(result.public_id);
      throw dbError;
    }

    res.status(201).json({
      success: true,
      url: result.secure_url,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ success: false, message: 'Upload failed' });
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error('Temp file cleanup failed:', err.message);
      });
    }
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      Image.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Image.countDocuments()
    ]);

    res.json({ 
      success: true, 
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch images error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
};
