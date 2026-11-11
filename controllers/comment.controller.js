const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');

// @desc    Add comment to ticket
// @access  Private (ticket creator, agent, or admin)
exports.addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Please provide comment text' });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions: creator, agent, or admin
    const isCreator = ticket.createdBy.toString() === req.user.id;
    const isAgent = ticket.assignedTo?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAgent && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to comment on this ticket' });
    }

    const comment = await Comment.create({
      text,
      createdBy: req.user.id,
      ticket: ticketId,
    });

    // Populate creator info
    await comment.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding comment', error: error.message });
  }
};

// @desc    Get ticket comments
// @access  Private (with role-based visibility)
exports.getComments = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Get comments - admins see all, others see public comments only
    let query = { ticket: ticketId };

    if (req.user.role !== 'admin') {
      // In a real app, we'd have a field like 'isInternal: false/true'
      // For now, show all comments but this is where role filtering would happen
      query.isInternal = false;
    }

    const comments = await Comment.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting comments', error: error.message });
  }
};