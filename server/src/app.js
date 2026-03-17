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
const authenticateToken = require('./middleware/auth.middleware');

app.use('/auth', authRoutes);

// Helper function to read data from JSON file
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// GET /items - Return all items
app.get('/items', (req, res) => {
  try {
    const data = readData();
    res.json(data.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /items - Add a new item
app.post('/items', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const newItem = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price || 0,
      quantity: req.body.quantity || 0,
      createdAt: new Date().toISOString()
    };
    data.items.push(newItem);
    if (writeData(data)) {
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: 'Failed to save item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// PUT /items/:id - Update an item
app.put('/items/:id', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const itemId = req.params.id;
    const itemIndex = data.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    data.items[itemIndex] = {
      ...data.items[itemIndex],
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      updatedAt: new Date().toISOString()
    };

    if (writeData(data)) {
      res.json(data.items[itemIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /items/:id - Delete an item
app.delete('/items/:id', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const itemId = req.params.id;
    const itemIndex = data.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = data.items.splice(itemIndex, 1)[0];
    if (writeData(data)) {
      res.json({ message: 'Item deleted successfully', item: deletedItem });
    } else {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = app;
