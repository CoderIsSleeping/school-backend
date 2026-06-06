const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  try {
    const { heading, details } = req.body;

    // Input validation
    if (!heading || !details) {
      return res.status(400).json({ success: false, message: 'Heading and details are required' });
    }

    if (typeof heading !== 'string' || typeof details !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid input types' });
    }

    const notice = new Notice({ heading: heading.trim(), details: details.trim() });
    await notice.save();

    res.status(201).json({ 
      success: true, 
      message: 'Notice created successfully',
      notice 
    });
  } catch (error) {
    console.error('Create notice error:', error.message);
    res.status(500).json({ success: false, message: 'Error creating notice' });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [notices, total] = await Promise.all([
      Notice.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notice.countDocuments()
    ]);

    res.json({ 
      success: true, 
      notices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch notices error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching notices' });
  }
};

exports.getLatestNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne().sort({ createdAt: -1 });
    
    if (!notice) {
      return res.status(404).json({ success: false, message: 'No notices found' });
    }

    res.json({ success: true, notice });
  } catch (error) {
    console.error('Fetch latest notice error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching latest notice' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting notice' });
  }
};
