const User = require('../models/user.model');

// @desc    Get all users (Admin only)
// @access  Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting users', error: error.message });
  }
};

// @desc    Update user role or status (Admin only)
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating user', error: error.message });
  }
};

// @desc    Delete user (Admin only)
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User removed',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user', error: error.message });
  }
};