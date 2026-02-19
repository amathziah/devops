const {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
} = require('../../src/utils/auth.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Utils', () => {
    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'password123';
            const hash = await hashPassword(password);
            expect(hash).not.toBe(password);
            expect(hash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
        });
    });

    describe('comparePassword', () => {
        it('should return true for matching password and hash', async () => {
            const password = 'password123';
            const hash = await bcrypt.hash(password, 10);
            const isMatch = await comparePassword(password, hash);
            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching password', async () => {
            const password = 'password123';
            const hash = await bcrypt.hash('otherpassword', 10);
            const isMatch = await comparePassword(password, hash);
            expect(isMatch).toBe(false);
        });
    });

    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const user = { id: '123', email: 'test@example.com' };
            const token = generateToken(user);
            expect(typeof token).toBe('string');
            const decoded = jwt.decode(token);
            expect(decoded.id).toBe(user.id);
            expect(decoded.email).toBe(user.email);
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const user = { id: '123', email: 'test@example.com' };
            const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key');
            const decoded = verifyToken(token);
            expect(decoded).toBeTruthy();
            expect(decoded.id).toBe(user.id);
        });

        it('should return null for invalid token', () => {
            const token = 'invalid-token';
            const decoded = verifyToken(token);
            expect(decoded).toBeNull();
        });
    });
});
