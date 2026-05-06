const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword, generateToken } = require('../utils/auth.utils');
const { readData, writeData } = require('../utils/storage');

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await readData();
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

        if (await writeData(data)) {
            const token = generateToken(newUser);
            res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }

    } catch (error) {
        console.error('[signup error]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await readData();

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
        console.error('[login error]', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
