const request = require('supertest');

// MOCK fs BEFORE requiring app
jest.mock('fs');
const fs = require('fs');

// Setup default mock implementation
// This ensures that when app.js calls readData(), it gets a fresh empty state
fs.readFileSync.mockImplementation(() => {
    return JSON.stringify({ items: [] });
});

// Mock writeFileSync to do nothing
fs.writeFileSync.mockImplementation(() => {
    return undefined;
});

// Now require app, which uses the mocked fs
const app = require('../src/app');

describe('GET /health', () => {
    it('should return 200 and status OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});

describe('GET /items', () => {
    beforeEach(() => {
        // Reset the mock to return empty items before each test
        fs.readFileSync.mockReturnValue(JSON.stringify({ items: [] }));
    });

    it('should return 200 and an empty array', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});

describe('POST /items', () => {
    beforeEach(() => {
        // Reset for this test too, though strictly not necessary if we want isolation
        fs.readFileSync.mockReturnValue(JSON.stringify({ items: [] }));
    });

    const jwt = require('jsonwebtoken');

    it('should create a new item when authenticated', async () => {
        const token = jwt.sign({ id: '123', email: 'test@test.com' }, process.env.JWT_SECRET || 'your-secret-key');

        const newItem = {
            name: 'Test Item',
            description: 'This is a test item'
        };

        const res = await request(app)
            .post('/items')
            .set('Authorization', `Bearer ${token}`)
            .send(newItem)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Item');
        expect(res.body).toHaveProperty('description', 'This is a test item');
        expect(res.body).toHaveProperty('createdAt');
    });
});
