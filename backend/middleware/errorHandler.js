/**
 * Global Express error handling middleware.
 * Must be registered LAST (after all routes) in server.js.
 * Returns a clean JSON error response for every unhandled error.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500;

  // Handle Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
