const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const itemsRoutes = require('./routes/items.routes');


app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;
