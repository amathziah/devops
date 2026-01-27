const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
    it('should return 200 and status OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});

describe('GET /items', () => {
    it('should return 200 and an empty array', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});

describe('POST /items', () => {
    it('should create a new item', async () => {
        const newItem = {
            name: 'Test Item',
            description: 'This is a test item'
        };

        const res = await request(app)
            .post('/items')
            .send(newItem)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Item');
        expect(res.body).toHaveProperty('description', 'This is a test item');
        expect(res.body).toHaveProperty('createdAt');
    });
});
