const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.error('❌ Error: No MongoDB connection string found in .env (checked MONGODB_URI, MONGO_URI, DATABASE_URL)');
    process.exit(1);
  }

  // Mask credentials for display
  const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log('Connecting to MongoDB Atlas at:', maskedUri);

  try {
    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    const connectTime = Date.now() - startTime;
    console.log(`✅ [MongoDB Atlas] Connected successfully in ${connectTime}ms!`);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Database Name:', mongoose.connection.name);
    console.log('   ReadyState:', mongoose.connection.readyState === 1 ? '1 (Connected)' : mongoose.connection.readyState);

    // Trigger admin ping to reset the inactivity timer on Atlas
    console.log('\nSending ping command to MongoDB Atlas Cluster0...');
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log('✅ [Ping Result]:', pingResult);

    // List collections to verify read access and activity
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ [Cluster0 Collections (${collections.length})]:`, collections.map(c => c.name));

    console.log('\n🎉 SUCCESS: MongoDB Atlas Cluster0 has been actively pinged and connection is verified.');
    console.log('   The 60-day auto-pause inactivity timer has been successfully reset.');

    await mongoose.disconnect();
    console.log('Connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Connection Failed]:', error.message);
    if (error.message.includes('whitelist')) {
      console.error('👉 Tip: Make sure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address: 0.0.0.0/0).');
    }
    process.exit(1);
  }
}

testConnection();
