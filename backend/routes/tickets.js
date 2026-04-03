const express = require('express');
const router = express.Router();
const {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  claimTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { getComments, createComment } = require('../controllers/commentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// All ticket routes require authentication
router.use(verifyToken);

// GET  /api/tickets     — list tickets (role-filtered)
// POST /api/tickets     — create ticket (client only, with optional file)
router
  .route('/')
  .get(getTickets)
  .post(requireRole('client'), upload.single('attachment'), createTicket);

// GET    /api/tickets/:id  — view single ticket
// PATCH  /api/tickets/:id  — update status (agent, admin)
// DELETE /api/tickets/:id  — delete ticket (admin)
router
  .route('/:id')
  .get(getTicketById)
  .patch(requireRole('agent', 'admin'), updateTicket)
  .delete(requireRole('admin'), deleteTicket);

// PATCH /api/tickets/:id/claim — agent claims a ticket
router.patch('/:id/claim', requireRole('agent', 'admin'), claimTicket);

// Comments nested under tickets
router
  .route('/:id/comments')
  .get(getComments)
  .post(createComment);

module.exports = router;
