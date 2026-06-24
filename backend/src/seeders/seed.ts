/**
 * Database Seeder
 * 
 * Populates the database with sample data for testing.
 * Run with: npm run seed
 */

import { sequelize } from '../config/database';
import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Request from '../models/Request.model';
import { hashPassword } from '../utils/auth.util';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database (creates tables)
    await sequelize.sync({ force: false });
    console.log('✅ Database synced');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.destroy({ where: {}, truncate: true });
    // await Donation.destroy({ where: {}, truncate: true });
    // await Request.destroy({ where: {}, truncate: true });

    // Create sample users
    const hashedPassword = await hashPassword('password123');

    const donor1 = await User.findOrCreate({
      where: { email: 'donor1@example.com' },
      defaults: {
        name: 'John Donor',
        email: 'donor1@example.com',
        password_hash: hashedPassword,
        role: 'Donor',
        location: 'New York, NY',
      },
    });

    const donor2 = await User.findOrCreate({
      where: { email: 'donor2@example.com' },
      defaults: {
        name: 'Jane Smith',
        email: 'donor2@example.com',
        password_hash: hashedPassword,
        role: 'Donor',
        location: 'Los Angeles, CA',
      },
    });

    const receiver1 = await User.findOrCreate({
      where: { email: 'receiver1@example.com' },
      defaults: {
        name: 'Hope Orphanage',
        email: 'receiver1@example.com',
        password_hash: hashedPassword,
        role: 'Receiver',
        location: 'Chicago, IL',
      },
    });

    const receiver2 = await User.findOrCreate({
      where: { email: 'receiver2@example.com' },
      defaults: {
        name: 'Community Center',
        email: 'receiver2@example.com',
        password_hash: hashedPassword,
        role: 'Receiver',
        location: 'Miami, FL',
      },
    });

    const admin = await User.findOrCreate({
      where: { email: 'admin@givista.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@givista.com',
        password_hash: hashedPassword,
        role: 'Admin',
        location: 'San Francisco, CA',
      },
    });

    console.log('✅ Users created');

    // Create sample donations
    if (donor1[0]) {
      await Donation.findOrCreate({
        where: { id: 1 },
        defaults: {
          donorId: donor1[0].id,
          title: 'Clothing Donation for Children',
          category: 'Clothes',
          quantity: 50,
          description: 'Gently used children\'s clothing in good condition, sizes 4-12.',
          status: 'Pending',
        },
      });

      await Donation.findOrCreate({
        where: { id: 2 },
        defaults: {
          donorId: donor1[0].id,
          title: 'Food Supplies',
          category: 'Food',
          quantity: 100,
          description: 'Non-perishable food items including canned goods, rice, and pasta.',
          status: 'Pending',
        },
      });
    }

    if (donor2[0]) {
      await Donation.findOrCreate({
        where: { id: 3 },
        defaults: {
          donorId: donor2[0].id,
          title: 'Monetary Donation',
          category: 'Money',
          quantity: 500,
          description: 'Monetary contribution to support orphanage operations.',
          status: 'Pending',
        },
      });
    }

    console.log('✅ Donations created');

    // Create sample requests
    if (receiver1[0]) {
      await Request.findOrCreate({
        where: { id: 1 },
        defaults: {
          receiverId: receiver1[0].id,
          title: 'Urgent Need: Blood Donation',
          description: 'We need O+ blood donations urgently for a child in our care.',
          category: 'Blood',
          urgency: 'High',
          status: 'Open',
        },
      });

      await Request.findOrCreate({
        where: { id: 2 },
        defaults: {
          receiverId: receiver1[0].id,
          title: 'Children\'s Clothing Needed',
          description: 'We need children\'s clothing, especially winter wear, sizes 6-10.',
          category: 'Clothes',
          urgency: 'Medium',
          status: 'Open',
        },
      });
    }

    if (receiver2[0]) {
      await Request.findOrCreate({
        where: { id: 3 },
        defaults: {
          receiverId: receiver2[0].id,
          title: 'Food Assistance',
          description: 'Looking for food donations to support our community kitchen program.',
          category: 'Food',
          urgency: 'Low',
          status: 'Open',
        },
      });
    }

    console.log('✅ Requests created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Sample login credentials:');
    console.log('  - Donor: donor1@example.com / password123');
    console.log('  - Receiver: receiver1@example.com / password123');
    console.log('  - Admin: admin@givista.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

