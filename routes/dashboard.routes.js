/**
 * Dashboard Routes
 * @description Role-specific dashboard data
 * @route GET /api/dashboard/stats - Get dashboard statistics (role-based)
 * @route GET /api/dashboard/my-tickets - Get user's tickets
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics (role-based)
// @access  Private
router.get('/stats', authenticate, dashboardController.getStats);

// @route   GET /api/dashboard/my-tickets
// @desc    Get current user's tickets
// @access  Private
router.get('/my-tickets', authenticate, dashboardController.getMyTickets);

module.exports = router;