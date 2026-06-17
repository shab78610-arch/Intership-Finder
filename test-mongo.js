const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing Local MongoDB Connection...');
  console.log('📝 Connection String:', process.env.MONGODB_URI);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`📦 Collections: ${await mongoose.connection.db.listCollections().toArray().then(cols => cols.map(c => c.name).join(', ')) || 'No collections yet'}`);

    // Create a test collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'Connection works!', timestamp: new Date() });
    console.log('✅ Test document inserted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB service is running (it is ✅)');
    console.log('2. Check if port 27017 is available');
    console.log('3. Try connecting with MongoDB Compass');
    process.exit(1);
  }
}

testConnection();