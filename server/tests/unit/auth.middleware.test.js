const authMiddleware = require('../../src/middleware/auth.middleware');
const { verifyToken } = require('../../src/utils/auth.utils');

jest.mock('../../src/utils/auth.utils');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        verifyToken.mockClear();
    });

    it('should return 401 if no authorization header is present', () => {
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
    });

    it('should return 403 if token is invalid', () => {
        req.headers.authorization = 'Bearer invalid-token';
        verifyToken.mockReturnValue(null);

        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token.' });
    });

    it('should call next() if token is valid', () => {
        const user = { id: '123' };
        req.headers.authorization = 'Bearer valid-token';
        verifyToken.mockReturnValue(user);

        authMiddleware(req, res, next);
        expect(req.user).toBe(user);
        expect(next).toHaveBeenCalled();
    });
});
