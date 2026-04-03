/**
 * Seed script — creates default admin and agent accounts.
 * Run with: npm run seed   OR   node utils/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove existing seed accounts to avoid duplicates
    await User.deleteMany({ email: { $in: ['admin@helpdesk.com', 'agent@helpdesk.com'] } });

    // Create admin and agent (passwords will be hashed by the User model's pre-save hook)
    await User.create([
      {
        name: 'Admin User',
        email: 'admin@helpdesk.com',
        password: 'Admin@123',
        role: 'admin',
      },
      {
        name: 'Support Agent',
        email: 'agent@helpdesk.com',
        password: 'Agent@123',
        role: 'agent',
      },
    ]);

    console.log('\n✅ Seed completed successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin:  admin@helpdesk.com  / Admin@123');
    console.log('Agent:  agent@helpdesk.com  / Agent@123');
    console.log('─────────────────────────────────\n');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
