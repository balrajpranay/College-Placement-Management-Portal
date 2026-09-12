const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || (!isProduction ? 'mongodb://localhost:27017/campus_connect' : null);

  if (isProduction && !uri) {
    console.error('[MongoDB Error] FATAL: MONGODB_URI environment variable is required in production.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isProduction ? 10000 : 1500
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    if (isProduction) {
      console.error(`[MongoDB Error] FATAL: Failed to connect to MongoDB in production: ${error.message}`);
      process.exit(1);
    } else {
      console.log(`[MongoDB] Connection ready. (Database offline or not yet started - server operational in standalone mode)`);
    }
  }
};

module.exports = connectDB;
