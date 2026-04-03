const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.statusCode = 400;
      return next(err);
    }

    // Check if email is already in use
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('Email is already registered');
      err.statusCode = 400;
      return next(err);
    }

    // Only allow 'client' registration via public endpoint
    // Agents and admins are created by seeding or admin panel
    const allowedRole = role === 'client' ? 'client' : 'client';

    const user = await User.create({ name, email, password, role: allowedRole });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      return next(err);
    }

    // Explicitly select password (it's hidden by default via schema `select: false`)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      return next(err);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private (JWT required)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
