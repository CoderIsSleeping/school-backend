const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ========================
// LOGIN
// ========================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input types'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Teachers cannot login until approved
    if (user.role === 'teacher' && user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is waiting for admin approval'
      });
    }

    if (user.role === 'teacher' && user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your registration request has been rejected'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// ========================
// TEACHER REGISTRATION
// ========================
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, username and password are required'
      });
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input types'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password: hashedPassword,
      role: 'teacher',
      status: 'pending'
    });

    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.'
    });

  } catch (error) {
    console.error('Registration error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};


// ========================
// CHANGE PASSWORD
// ========================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input types'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

    // ========================
// GET PENDING TEACHERS
// ========================
exports.getPendingTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      status: 'pending'
    }).select('-password');

    res.json({
      success: true,
      teachers
    });

  } catch (error) {
    console.error('Fetch pending teachers error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error fetching pending teachers'
    });
  }
};


// ========================
// APPROVE TEACHER
// ========================
exports.approveTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: 'teacher'
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    teacher.status = 'approved';
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher approved successfully'
    });

  } catch (error) {
    console.error('Approve teacher error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error approving teacher'
    });
  }
};


// ========================
// REJECT TEACHER
// ========================
exports.rejectTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: 'teacher'
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    teacher.status = 'rejected';
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher rejected successfully'
    });

  } catch (error) {
    console.error('Reject teacher error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error rejecting teacher'
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
