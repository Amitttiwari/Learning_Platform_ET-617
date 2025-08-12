const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const analyticsRoutes = require('./routes/analytics');
const { initDatabase } = require('./database/init');
const { migrateDatabase } = require('./database/migrate');
const db = require('./database/db'); // Added for the new test endpoint

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://ashwaniiitbb.github.io',
      /^https:\/\/.*\.netlify\.app$/,
      /^https:\/\/.*\.netlify\.com$/
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Force redeploy - CORS fix for Netlify domains
console.log('CORS configured for Netlify domains');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Clickstream tracking middleware
app.use((req, res, next) => {
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent');
  const timestamp = new Date().toISOString();
  
  // Log all requests for analytics
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  next();
});

// Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/courses', courseRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint to check database users
app.get('/api/test/users', (req, res) => {
  db.all('SELECT id, username, email, role FROM users', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ users: rows });
  });
});

// API-only server - frontend will be served separately
app.get('/', (req, res) => {
  res.json({ 
    message: 'Learning Platform API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Run database migration
    await migrateDatabase();
    console.log('Database migration completed');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 