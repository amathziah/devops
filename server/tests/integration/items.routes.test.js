const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

jest.mock('../../src/utils/storage');
const { readData, writeData } = require('../../src/utils/storage');

describe('Items Routes', () => {
    let mockData;
    let token;

    beforeEach(() => {
        mockData = {
            items: [],
            users: [{ id: '1', email: 'test@example.com', password: 'hash' }]
        };

        readData.mockImplementation(async () => JSON.parse(JSON.stringify(mockData)));
        writeData.mockImplementation(async (data) => {
            mockData = JSON.parse(JSON.stringify(data));
            return true;
        });

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
                .send({ name: 'New Item', description: 'Desc', price: 10 });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('New Item');
            expect(mockData.items).toHaveLength(1);
        });

        it('should fail when not authenticated', async () => {
            const res = await request(app)
                .post('/items')
                .send({ name: 'New Item' });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /items/:id', () => {
        it('should update an item when authenticated', async () => {
            mockData.items.push({ id: '1', name: 'Original', description: 'Desc' });

            const res = await request(app)
                .put('/items/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Updated', description: 'Updated Desc' });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Updated');
            expect(mockData.items[0].name).toBe('Updated');
        });
    });

    describe('DELETE /items/:id', () => {
        it('should delete an item when authenticated', async () => {
            mockData.items.push({ id: '1', name: 'To Delete' });

            const res = await request(app)
                .delete('/items/1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(mockData.items).toHaveLength(0);
        });

        it('should return 404 when item to delete does not exist', async () => {
            const res = await request(app)
                .delete('/items/999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('Edge Cases & Error Handling', () => {
        it('should return 404 when item to update does not exist', async () => {
            const res = await request(app)
                .put('/items/999')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Fail' });

            expect(res.statusCode).toBe(404);
        });

        it('should return 500 when readData fails', async () => {
            readData.mockRejectedValueOnce(new Error('Read Error'));
            const res = await request(app).get('/items');
            expect(res.statusCode).toBe(500);
        });

        it('should return 500 when writeData fails on POST', async () => {
            writeData.mockResolvedValueOnce(false);
            const res = await request(app)
                .post('/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Fail' });
            expect(res.statusCode).toBe(500);
        });
    });
});
