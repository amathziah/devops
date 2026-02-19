const { verifyToken } = require('../utils/auth.utils');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
};

module.exports = authenticateToken;
