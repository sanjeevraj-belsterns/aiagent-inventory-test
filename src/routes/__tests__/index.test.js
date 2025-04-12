import request from 'supertest';
import express from 'express';
import router from '../index.js';

const app = express();
app.use(router);

describe('API Routes', () => {
    test('GET /user', async () => {
        const response = await request(app).get('/user');
        expect(response.statusCode).toBe(200);
    });

    test('GET /inventory', async () => {
        const response = await request(app).get('/inventory');
        expect(response.statusCode).toBe(200);
    });

    test('GET /invoice', async () => {
        const response = await request(app).get('/invoice');
        expect(response.statusCode).toBe(200);
    });

    test('GET /dashboard', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.statusCode).toBe(200);
    });
});