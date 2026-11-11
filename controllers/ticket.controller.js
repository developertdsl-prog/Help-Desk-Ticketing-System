const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');

// @desc    Create new ticket
// @access  Customer
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating ticket', error: error.message });
  }
};

// @desc    List tickets with filters
// @access  Admin, Support-Agent
exports.getTickets = async (req, res) => {
  try {
    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by assigned agent
    if (req.query.agent) {
      query.assignedTo = req.query.agent;
    }

    // Admins see all, agents see only their assigned
    if (req.user.role !== 'admin') {
      query.assignedTo = req.user.id;
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting tickets', error: error.message });
  }
};

// @desc    Get ticket details
// @access  Admin, Support-Agent, Creator
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions: admin, agent, or creator
    if (
      req.user.role !== 'admin' &&
      ticket.createdBy.toString() !== req.user.id &&
      ticket.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting ticket', error: error.message });
  }
};

// @desc    Edit ticket
// @access  Creator or Admin
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions: creator or admin
    if (
      ticket.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;

    await ticket.save();

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating ticket', error: error.message });
  }
};

// @desc    Delete ticket
// @access  Admin only
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket removed',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting ticket', error: error.message });
  }
};