const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

/**
 * @route   GET /api/tickets
 * @desc    Get tickets — clients see own; agents/admins see all
 * @access  Private
 */
const getTickets = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;

    // Build filter object based on role
    const filter = {};
    if (req.user.role === 'client') {
      filter.clientId = req.user.id;
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate('clientId', 'name email')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/tickets
 * @desc    Create a new ticket (client only)
 * @access  Private (client)
 */
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category || !priority) {
      const err = new Error('Title, description, category, and priority are required');
      err.statusCode = 400;
      return next(err);
    }

    // If a file was uploaded via multer, store its filename
    const attachmentUrl = req.file ? req.file.filename : null;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      clientId: req.user.id,
      attachmentUrl,
    });

    await ticket.populate('clientId', 'name email');

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/tickets/:id
 * @desc    Get a single ticket by ID
 * @access  Private — clients can only access their own tickets
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('agentId', 'name email');

    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    // Clients can only view their own tickets
    if (req.user.role === 'client' && ticket.clientId._id.toString() !== req.user.id) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      return next(err);
    }

    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PATCH /api/tickets/:id
 * @desc    Update ticket status (agents and admins only)
 * @access  Private (agent, admin)
 */
const updateTicket = async (req, res, next) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    if (status) ticket.status = status;

    const updated = await ticket.save();
    await updated.populate('clientId', 'name email');
    await updated.populate('agentId', 'name email');

    res.json({ success: true, ticket: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PATCH /api/tickets/:id/claim
 * @desc    Agent claims an unclaimed ticket (sets agentId, changes status to In Progress)
 * @access  Private (agent)
 */
const claimTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    if (ticket.agentId) {
      const err = new Error('This ticket has already been claimed by an agent');
      err.statusCode = 400;
      return next(err);
    }

    ticket.agentId = req.user.id;
    ticket.status = 'In Progress';

    const updated = await ticket.save();
    await updated.populate('clientId', 'name email');
    await updated.populate('agentId', 'name email');

    res.json({ success: true, ticket: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Delete a ticket and its comments (admin only)
 * @access  Private (admin)
 */
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    // Delete all associated comments first
    await Comment.deleteMany({ ticketId: ticket._id });
    await ticket.deleteOne();

    res.json({ success: true, message: 'Ticket and its comments deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTickets, createTicket, getTicketById, updateTicket, claimTicket, deleteTicket };
