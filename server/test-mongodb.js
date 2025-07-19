import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const lookup = promisify(dns.lookup);

console.log('Testing MongoDB Connection...\n');

// Test DNS resolution
async function testDNS() {
  console.log('1. Testing DNS Resolution:');
  const hosts = [
    'ac-zhqqyxi-shard-00-00.9wspd3a.mongodb.net',
    'ac-zhqqyxi-shard-00-01.9wspd3a.mongodb.net',
    'ac-zhqqyxi-shard-00-02.9wspd3a.mongodb.net'
  ];
  
  for (const host of hosts) {
    try {
      const result = await lookup(host);
      console.log(`   ✓ ${host} -> ${result.address}`);
    } catch (error) {
      console.log(`   ✗ ${host} -> Failed: ${error.message}`);
    }
  }
  console.log();
}

// Test MongoDB connection
async function testMongoDB() {
  console.log('2. Testing MongoDB Connection:');
  console.log(`   URI: ${process.env.MONGODB_URI?.replace(/:[^:]*@/, ':****@')}`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });
    console.log('   ✓ Successfully connected to MongoDB!');
    
    // Test database operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   ✓ Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    console.log('   ✓ Successfully disconnected');
  } catch (error) {
    console.log(`   ✗ Connection failed: ${error.message}`);
    console.log('\n   Possible issues:');
    console.log('   - Check your internet connection');
    console.log('   - Verify your IP is whitelisted in MongoDB Atlas');
    console.log('   - Check if you\'re behind a firewall or VPN');
    console.log('   - Ensure the connection string in .env is correct');
  }
}

// Run tests
async function runTests() {
  await testDNS();
  await testMongoDB();
  process.exit(0);
}

runTests().catch(console.error);