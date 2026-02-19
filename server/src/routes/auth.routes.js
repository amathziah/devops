const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth.utils');

const DATA_FILE = path.join(__dirname, '../../data.json');

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return { users: [], items: [] };
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], items: [] };
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
};

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = readData();
        if (!data.users) data.users = [];

        if (data.users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword
        };

        data.users.push(newUser);

        if (writeData(data)) {
            const token = generateToken(newUser);
            res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = readData();

        const user = data.users?.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
