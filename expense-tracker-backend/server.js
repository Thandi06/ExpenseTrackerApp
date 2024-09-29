// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Public Routes
app.use('/api/auth', require('./routes/auth'));

// Protected Routes
const authMiddleware = require('./middleware/auth');
app.use('/api/expenses', authMiddleware, require('./routes/expenses'));

// Default Route
app.get('/', (req, res) => {
    res.send('Expense Tracker Backend is running.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
