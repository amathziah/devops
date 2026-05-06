const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/utils/storage');
const { readData, writeData } = require('../src/utils/storage');

const app = require('../src/app');

beforeEach(() => {
    const mockData = { users: [], items: [] };
    readData.mockImplementation(async () => JSON.parse(JSON.stringify(mockData)));
    writeData.mockImplementation(async () => true);
});

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
    it('should create a new item when authenticated', async () => {
        const token = jwt.sign({ id: '123', email: 'test@test.com' }, process.env.JWT_SECRET || 'your-secret-key');

        const res = await request(app)
            .post('/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', description: 'This is a test item' })
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Item');
        expect(res.body).toHaveProperty('description', 'This is a test item');
        expect(res.body).toHaveProperty('createdAt');
    });
});
