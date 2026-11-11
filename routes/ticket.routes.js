/**
 * Ticket Management Routes
 * @description CRUD operations for tickets
 * @route POST /api/tickets - Create new ticket (Customers only)
 * @route GET /api/tickets - List tickets with filters (Admins/Agents)
 * @route GET /api/tickets/:id - Get ticket details
 * @route PUT /api/tickets/:id - Edit ticket (Creator or Admin)
 * @route DELETE /api/tickets/:id - Delete ticket (Admin only)
 */

const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Customer
router.post('/', authenticate, ticketController.createTicket);

// @route   GET /api/tickets
// @desc    List tickets with filters (Admins see all, Agents see assigned)
// @access  Admin, Support-Agent
router.get('/', authenticate, ticketController.getTickets);

// @route   GET /api/tickets/:id
// @desc    Get ticket details
// @access  Admin, Support-Agent, Creator
router.get('/:id', authenticate, ticketController.getTicket);

// @route   PUT /api/tickets/:id
// @desc    Edit ticket (Creator or Admin)
// @access  Creator, Admin
router.put('/:id', authenticate, ticketController.updateTicket);

// @route   DELETE /api/tickets/:id
// @desc    Delete ticket (Admin only)
// @access  Admin
router.delete('/:id', authenticate, authorize('admin'), ticketController.deleteTicket);

module.exports = router;