import request from 'supertest';
import express from 'express';
import router from '../../src/routes/index.js';

const app = express();
app.use(router);

describe('API Routes', () => {
    test('GET /user should respond with 200', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(200);
    });

    test('GET /inventory should respond with 200', async () => {
        const response = await request(app).get('/inventory');
        expect(response.status).toBe(200);
    });

    test('GET /invoice should respond with 200', async () => {
        const response = await request(app).get('/invoice');
        expect(response.status).toBe(200);
    });

    test('GET /dashboard should respond with 200', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.status).toBe(200);
    });
});