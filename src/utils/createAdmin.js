import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: './src/config/config.env' });

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      name: 'Admin',
      email: 'admin@yenom.com',
      password: 'admin123',
      role: 'admin'
    };

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });
    
    if (adminExists) {
      console.log('Admin user already exists'.yellow);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('Admin user created successfully'.green);
    console.log('Email:'.bold, admin.email);
    console.log('Password:'.bold, 'admin123 (Please change this after first login)'.yellow);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Execute the function
createAdmin();
