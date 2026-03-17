const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '../data.json');

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const itemsRoutes = require('./routes/items.routes');
const authenticateToken = require('./middleware/auth.middleware');

app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
