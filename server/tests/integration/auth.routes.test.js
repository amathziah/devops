const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');

// Mock fs to avoid writing to real files
jest.mock('fs');

describe('Auth Routes', () => {
    let mockData;

    beforeEach(() => {
        mockData = { users: [], items: [] };
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockImplementation(() => JSON.stringify(mockData));
        fs.writeFileSync.mockImplementation((file, data) => {
            mockData = JSON.parse(data);
            return true;
        });
    });

    describe('POST /auth/signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.email).toBe('test@example.com');
            expect(mockData.users).toHaveLength(1);
        });

        it('should fail if user already exists', async () => {
            // Pre-seed user
            mockData.users.push({
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword'
            });

            const res = await request(app)
                .post('/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('User already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            // Register a user first (through the app logic or seed)
            // But since we mock fs, we can just seed logic or use the signup endpoint
            // However, bcrypt is real, so we need a real hash if we check manually?
            // Actually, we can just use the signup endpoint in test flow or manually hash.
            // Let's use the signup endpoint to ensure flow is correct.

            await request(app)
                .post('/auth/signup')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with invalid credentials', async () => {
            await request(app)
                .post('/auth/signup')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(400);
        });
    });
});
