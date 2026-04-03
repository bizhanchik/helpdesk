const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics for the admin dashboard
 * @access  Private (admin)
 */
const getStats = async (req, res, next) => {
  try {
    const [totalTickets, totalUsers, ticketsByStatus, ticketsByCategory, ticketsByPriority] =
      await Promise.all([
        Ticket.countDocuments(),
        User.countDocuments(),
        // Aggregate tickets grouped by status
        Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        // Aggregate tickets grouped by category
        Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        // Aggregate tickets grouped by priority
        Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      ]);

    // Flatten aggregate results into plain objects for easier frontend consumption
    const statusMap = ticketsByStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
    const categoryMap = ticketsByCategory.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
    const priorityMap = ticketsByPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});

    res.json({
      success: true,
      stats: {
        totalTickets,
        totalUsers,
        openTickets: (statusMap['New'] || 0) + (statusMap['In Progress'] || 0),
        resolvedTickets: (statusMap['Resolved'] || 0) + (statusMap['Closed'] || 0),
        ticketsByStatus: statusMap,
        ticketsByCategory: categoryMap,
        ticketsByPriority: priorityMap,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users (passwords excluded)
 * @access  Private (admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user account (admin cannot delete themselves)
 * @access  Private (admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      const err = new Error('You cannot delete your own admin account');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/admin/tickets/:id
 * @desc    Delete any ticket and all its comments (admin only)
 * @access  Private (admin)
 */
const deleteTicketAdmin = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    await Comment.deleteMany({ ticketId: ticket._id });
    await ticket.deleteOne();

    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getAllUsers, deleteUser, deleteTicketAdmin };
