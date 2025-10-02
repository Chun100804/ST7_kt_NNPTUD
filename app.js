const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'JSON không hợp lệ',
      error: 'Invalid JSON format'
    });
  }
  next(err);
});

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;
