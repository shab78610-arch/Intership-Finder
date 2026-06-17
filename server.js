const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection for LOCAL MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected Successfully (Local)');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('💡 Make sure MongoDB service is running');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    database: mongoose.connection.db?.databaseName || 'N/A'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    msg: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
});