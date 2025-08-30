import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

// Now you can use process.env.MONGODB_URI
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); // Use the environment variable
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
