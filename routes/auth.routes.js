/**
 * Authentication Routes
 * @description User registration, login, and profile management
 * @route POST /api/auth/register - Register new user
 * @route POST /api/auth/login - User login
 * @route GET /api/auth/me - Get current user profile
 * @route POST /api/auth/password-reset - Request password reset
 * @route POST /api/auth/reset-password - Reset password with token
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and receive JWT token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET /api/auth/me
// @desc    Get current user profile (protected)
// @access  Private
router.get('/me', authController.getProfile);

// @route   POST /api/auth/password-reset
// @desc    Send password reset token via email
// @access  Public
router.post('/password-reset', authController.requestPasswordReset);

// @route   POST /api/auth/reset-password
// @desc    Reset password with reset token
// @access  Public
router.post('/reset-password', authController.resetPassword);

module.exports = router;