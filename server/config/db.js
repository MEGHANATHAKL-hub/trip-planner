import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Add connection options to handle DNS and network issues
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      // Add these options for better connectivity
      family: 4, // Use IPv4, sometimes IPv6 causes issues
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 30000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('\n=== TROUBLESHOOTING STEPS ===');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB URI is correct in .env file');
    console.error('3. Ensure your IP is whitelisted in MongoDB Atlas:');
    console.error('   - Go to MongoDB Atlas > Network Access');
    console.error('   - Add your current IP or use 0.0.0.0/0 for all IPs (development only)');
    console.error('4. Check if you can reach MongoDB Atlas:');
    console.error('   - Try: nslookup ac-zhqqyxi-shard-00-01.9wspd3a.mongodb.net');
    console.error('5. If using VPN, try disconnecting');
    console.error('6. Check firewall settings');
    console.error('===========================\n');
    
    // Don't exit immediately in development, retry connection
    if (process.env.NODE_ENV === 'development') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(() => connectDB(), 5000);
    } else {
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

export default connectDB;