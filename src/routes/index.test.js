import request from 'supertest';
import express from 'express';
import router from './index.js';

const app = express();
app.use(router);

describe('API Routes', () => {
    it('should route to user endpoints', async () => {
        const response = await request(app).get('/user');
        expect(response.status).not.toBe(404);
    });

    it('should route to inventory endpoints', async () => {
        const response = await request(app).get('/inventory');
        expect(response.status).not.toBe(404);
    });

    it('should route to invoice endpoints', async () => {
        const response = await request(app).get('/invoice');
        expect(response.status).not.toBe(404);
    });

    it('should route to dashboard endpoints', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.status).not.toBe(404);
    });
});