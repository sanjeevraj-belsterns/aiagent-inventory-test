import request from 'supertest';
import express from 'express';
import router from './index.js';

const app = express();
app.use(router);

describe('API Routes', () => {
    test('GET /user should respond with 200', async () => {
        const response = await request(app).get('/user');
        expect(response.statusCode).toBe(200);
    });

    test('GET /inventory should respond with 200', async () => {
        const response = await request(app).get('/inventory');
        expect(response.statusCode).toBe(200);
    });

    test('GET /invoice should respond with 200', async () => {
        const response = await request(app).get('/invoice');
        expect(response.statusCode).toBe(200);
    });

    test('GET /dashboard should respond with 200', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.statusCode).toBe(200);
    });
});