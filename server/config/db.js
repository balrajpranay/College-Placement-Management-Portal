const mongoose = require('mongoose');

// Global connection caching across Vercel serverless invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || (!isProduction ? 'mongodb://localhost:27017/campus_connect' : null);

  if (!uri) {
    if (isProduction) {
      console.warn('[MongoDB Notice] MONGODB_URI environment variable not configured. Running with in-memory fallback stores.');
    } else {
      console.log('[MongoDB Notice] Running in standalone development mode with in-memory stores.');
    }
    return null;
  }

  // Reuse cached connection if already established
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: isProduction ? 5000 : 1500,
      bufferCommands: false
    };

    cached.promise = mongoose.connect(uri, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully to host: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.warn(`[MongoDB Notice] Database connection unavailable: ${error.message}. Running with in-memory fallback stores.`);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
};

module.exports = connectDB;
