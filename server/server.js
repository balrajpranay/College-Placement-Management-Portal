require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database asynchronously
connectDB();

// Core Middleware
const corsOptions = process.env.CLIENT_ORIGIN
  ? { origin: process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()), credentials: true }
  : {};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../static')));

// Database readiness middleware for Vercel Serverless and Production
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
  } catch (err) {
    console.warn('[MongoDB Middleware] Connection notice:', err.message);
  }
  next();
});
// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Campus Connect Node.js + Express Backend Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/recruiters', require('./routes/recruiters'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/ai', require('./routes/ai'));

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Express server.`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Express Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server on 0.0.0.0 (Only when run directly in standalone/local mode, bypassed in Vercel serverless)
if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] Server running on http://127.0.0.1:${PORT}`);
    console.log(`[Express] Health check available at: http://127.0.0.1:${PORT}/api/health`);
  });
}

module.exports = app;
