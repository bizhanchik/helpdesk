const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, deleteTicketAdmin } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All admin routes require JWT + admin role
router.use(verifyToken, requireRole('admin'));

// GET    /api/admin/stats          — system statistics
router.get('/stats', getStats);

// GET    /api/admin/users          — list all users
// DELETE /api/admin/users/:id      — delete a user
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// DELETE /api/admin/tickets/:id    — delete any ticket
router.delete('/tickets/:id', deleteTicketAdmin);

module.exports = router;
