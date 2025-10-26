const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  try {
    const { heading, details } = req.body;

    const notice = new Notice({ heading, details });
    await notice.save();

    res.json({ 
      success: true, 
      message: 'Notice created successfully',
      notice 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice', error: error.message });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
};

exports.getLatestNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne().sort({ createdAt: -1 });
    res.json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest notice', error: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice', error: error.message });
  }
};
