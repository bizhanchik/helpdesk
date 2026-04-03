const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user ID and role.
 * @param {string} id - The user's MongoDB ObjectId
 * @param {string} role - The user's role (client, agent, admin)
 * @returns {string} Signed JWT string
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
