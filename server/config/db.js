const mongoose = require('mongoose');

// Global connection caching across Vercel serverless invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || (!isProduction ? 'mongodb://localhost:27017/campus_connect' : null);

  if (isProduction && !uri) {
    console.error('[MongoDB Error] FATAL: MONGODB_URI environment variable is required in production.');
    process.exit(1);
  }

  // Reuse cached connection if already established
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: isProduction ? 10000 : 1500,
      bufferCommands: false
    };

    cached.promise = mongoose.connect(uri, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully to host: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        if (isProduction) {
          console.error(`[MongoDB Error] FATAL: Failed to connect to MongoDB in production: ${error.message}`);
          process.exit(1);
        } else {
          console.log(`[MongoDB] Connection ready. (Database offline or not yet started - server operational in standalone mode)`);
          return null;
        }
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
};

module.exports = connectDB;
