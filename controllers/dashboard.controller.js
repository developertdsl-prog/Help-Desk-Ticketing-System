const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');

// @desc    Get dashboard statistics (role-based)
// @access  Private
exports.getStats = async (req, res) => {
  try {
    let stats;

    switch (req.user.role) {
      case 'admin':
        // Admin sees all stats
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
        const closedTickets = await Ticket.countDocuments({ status: 'closed' });

        const ticketsByPriority = await Ticket.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const ticketsByCategory = await Ticket.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        stats = {
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          ticketsByPriority,
          ticketsByCategory,
        };
        break;

      case 'support-agent':
        // Agent sees their assigned tickets stats
        const assignedTickets = await Ticket.countDocuments({ assignedTo: req.user.id });
        const myOpenTickets = await Ticket.countDocuments({ assignedTo: req.user.id, status: 'open' });
        const myInProgressTickets = await Ticket.countDocuments({ assignedTo: req.user.id, status: 'in-progress' });
        const myResolvedTickets = await Ticket.countDocuments({ assignedTo: req.user.id, status: 'resolved' });
        const myClosedTickets = await Ticket.countDocuments({ assignedTo: req.user.id, status: 'closed' });

        stats = {
          assignedTickets,
          myOpenTickets,
          myInProgressTickets,
          myResolvedTickets,
          myClosedTickets,
        };
        break;

      case 'customer':
        // Customer sees their own tickets stats
        const myTickets = await Ticket.countDocuments({ createdBy: req.user.id });
        const myOpenTickets = await Ticket.countDocuments({ createdBy: req.user.id, status: 'open' });
        const myResolvedTickets = await Ticket.countDocuments({ createdBy: req.user.id, status: 'resolved' });
        const myClosedTickets = await Ticket.countDocuments({ createdBy: req.user.id, status: 'closed' });

        stats = {
          myTickets,
          myOpenTickets,
          myResolvedTickets,
          myClosedTickets,
        };
        break;

      default:
        return res.status(403).json({ message: 'Role not recognized for dashboard' });
    }

    res.json({
      success: true,
      stats,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting dashboard stats', error: error.message });
  }
};

// @desc    Get current user's tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    let query = { createdBy: req.user.id };

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error getting my tickets', error: error.message });
  }
};