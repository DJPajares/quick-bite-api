import 'dotenv/config';
import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser';

/**
 * Seed script to create initial admin users
 * Run with: pnpm run seed:admin
 */

const adminUsers = [
  {
    username: 'admin',
    password: 'Admin123!',
    name: 'System Administrator',
    role: 'admin' as const
  },
  {
    username: 'kitchen',
    password: 'Kitchen123!',
    name: 'Kitchen Staff',
    role: 'kitchen-staff' as const
  }
];

const seedAdminUsers = async (): Promise<void> => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing admin users (optional - comment out if you want to keep existing users)
    // await AdminUser.deleteMany({});
    // console.log('🗑️  Cleared existing admin users');

    // Create admin users
    for (const userData of adminUsers) {
      const existingUser = await AdminUser.findOne({
        username: userData.username
      });

      if (existingUser) {
        console.log(
          `⚠️  User '${userData.username}' already exists, skipping...`
        );
        continue;
      }

      const user = await AdminUser.create(userData);
      console.log(`✅ Created ${user.role}: ${user.username} (${user.name})`);
    }

    console.log('\n🎉 Admin user seeding completed!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin:');
    console.log('   - Username: admin');
    console.log('   - Password: Admin123!');
    console.log('\n   Kitchen Staff:');
    console.log('   - Username: kitchen');
    console.log('   - Password: Kitchen123!');
    console.log('\n⚠️  IMPORTANT: Change these passwords in production!\n');
  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedAdminUsers();
