/**
 * Notification Routes
 * @description Comments and notifications for tickets
 * @route POST /api/tickets/:id/comments - Add comment to ticket
 * @route GET /api/tickets/:id/comments - Get ticket comments
 */

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// @route   POST /api/tickets/:id/comments
// @desc    Add comment to ticket
// @access  Private (ticket creator, agent, or admin)
router.post('/:ticketId', authenticate, commentController.addComment);

// @route   GET /api/tickets/:id/comments
// @desc    Get ticket comments
// @access  Private (with role-based visibility)
router.get('/:ticketId', authenticate, commentController.getComments);

module.exports = router;