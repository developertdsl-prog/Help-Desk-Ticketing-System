/**
 * User Management Routes
 * @description Admin user management - list, update, delete users
 * @route GET /api/users - List all users (Admin only)
 * @route PUT /api/users/:id - Update user role/status (Admin only)
 * @route DELETE /api/users/:id - Delete user (Admin only)
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/users
// @desc    List all users (Admin only)
// @access  Admin
router.get('/', authenticate, authorize('admin'), userController.getUsers);

// @route   PUT /api/users/:id
// @desc    Update user role or status (Admin only)
// @access  Admin
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Admin
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;