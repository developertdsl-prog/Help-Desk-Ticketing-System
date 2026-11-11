const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error.middleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);

// Error handler (should be placed after all other app.use() and routes calls)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;