require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://internship-portal-khaki.vercel.app',
];

const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, Render health checks)
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json());

// Root service status route
app.get('/', (req, res) => {
  res.json({
    name: 'Student Internship Portal API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/internships',
  });
});

// Accurate health check route
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    return res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(503).json({
    status: 'Degraded',
    database: 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// JSON 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS origin not allowed.' });
  }

  console.error('Server error occurred:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'An unexpected internal server error occurred.',
  });
});

// Server startup function
function startServer() {
  return new Promise(async (resolve, reject) => {
    if (!process.env.MONGO_DB_URI) {
      console.error('Fatal error: MONGO_DB_URI is missing. Please set it in your environment.');
      return reject(new Error('MONGO_DB_URI is missing'));
    }

    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_DB_URI, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log('MongoDB connected successfully!');

      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server listening on port ${PORT}`);
        resolve(server);
      });
      server.on('error', reject);
    } catch (error) {
      console.error('Database connection failed on startup:', error.message);
      reject(error);
    }
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
