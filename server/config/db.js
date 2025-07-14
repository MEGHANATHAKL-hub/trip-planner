import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Please check:');
    console.error('1. MongoDB URI is correct');
    console.error('2. IP address is whitelisted in MongoDB Atlas');
    console.error('3. Database user has proper permissions');
    process.exit(1);
  }
};

export default connectDB;