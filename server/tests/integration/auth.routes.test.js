const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/utils/storage');
const { readData, writeData } = require('../../src/utils/storage');

describe('Auth Routes', () => {
    let mockData;

    beforeEach(() => {
        mockData = { users: [], items: [] };

        readData.mockImplementation(async () => JSON.parse(JSON.stringify(mockData)));
        writeData.mockImplementation(async (data) => {
            mockData = JSON.parse(JSON.stringify(data));
            return true;
        });
    });

    describe('POST /auth/signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.email).toBe('test@example.com');
            expect(mockData.users).toHaveLength(1);
        });

        it('should fail if user already exists', async () => {
            mockData.users.push({ id: '1', email: 'test@example.com', password: 'hashedpassword' });

            const res = await request(app)
                .post('/auth/signup')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('User already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            await request(app)
                .post('/auth/signup')
                .send({ email: 'login@example.com', password: 'password123' });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'login@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with invalid credentials', async () => {
            await request(app)
                .post('/auth/signup')
                .send({ email: 'login@example.com', password: 'password123' });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'login@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(400);
        });

        it('should fail if email is missing', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ password: '123' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Signup Validation Edge Cases', () => {
        it('should fail if email is missing', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({ password: '123' });
            expect(res.statusCode).toBe(400);
        });
    });
});
