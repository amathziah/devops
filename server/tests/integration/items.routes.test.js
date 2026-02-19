const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const jwt = require('jsonwebtoken');

jest.mock('fs');

describe('Items Routes', () => {
    let mockData;
    let token;

    beforeEach(() => {
        mockData = {
            items: [],
            users: [{ id: '1', email: 'test@example.com', password: 'hash' }]
        };
        fs.readFileSync.mockImplementation(() => JSON.stringify(mockData));
        fs.writeFileSync.mockImplementation((file, data) => {
            mockData = JSON.parse(data);
            return true;
        });

        // Generate a valid token for testing protected routes
        token = jwt.sign({ id: '1', email: 'test@example.com' }, process.env.JWT_SECRET || 'your-secret-key');
    });

    describe('GET /items', () => {
        it('should return all items', async () => {
            mockData.items.push({ id: '1', name: 'Item 1' });

            const res = await request(app).get('/items');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe('Item 1');
        });
    });

    describe('POST /items', () => {
        it('should add a new item when authenticated', async () => {
            const res = await request(app)
                .post('/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'New Item',
                    description: 'Desc',
                    price: 10
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('New Item');
            expect(mockData.items).toHaveLength(1);
        });

        it('should fail when not authenticated', async () => {
            const res = await request(app)
                .post('/items')
                .send({
                    name: 'New Item'
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /items/:id', () => {
        it('should update an item when authenticated', async () => {
            const item = { id: '1', name: 'Original', description: 'Desc' };
            mockData.items.push(item);

            const res = await request(app)
                .put('/items/1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated',
                    description: 'Updated Desc'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Updated');
            expect(mockData.items[0].name).toBe('Updated');
        });
    });

    describe('DELETE /items/:id', () => {
        it('should delete an item when authenticated', async () => {
            const item = { id: '1', name: 'To Delete' };
            mockData.items.push(item);

            const res = await request(app)
                .delete('/items/1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(mockData.items).toHaveLength(0);
        });
    });
});
