import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://Hacify:Hacify%40123@cluster0.aborme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
