const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

/**
 * @route   GET /api/tickets/:id/comments
 * @desc    Get all comments for a ticket
 * @access  Private
 */
const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    // Clients can only view comments on their own tickets
    if (req.user.role === 'client' && ticket.clientId.toString() !== req.user.id) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      return next(err);
    }

    const comments = await Comment.find({ ticketId: req.params.id })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 }); // oldest first for chat-like display

    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/tickets/:id/comments
 * @desc    Add a comment to a ticket
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      const err = new Error('Comment text is required');
      err.statusCode = 400;
      return next(err);
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    // Clients can only comment on their own tickets
    if (req.user.role === 'client' && ticket.clientId.toString() !== req.user.id) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      return next(err);
    }

    const comment = await Comment.create({
      ticketId: req.params.id,
      senderId: req.user.id,
      text: text.trim(),
    });

    await comment.populate('senderId', 'name role');

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, createComment };
