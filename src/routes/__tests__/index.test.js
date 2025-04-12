import request from 'supertest';
import express from 'express';
import router from '../index.js';

const app = express();
app.use(router);

describe('API Routes', () => {
    it('should route to user', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(200);
    });

    it('should route to inventory', async () => {
        const response = await request(app).get('/inventory');
        expect(response.status).toBe(200);
    });

    it('should route to invoice', async () => {
        const response = await request(app).get('/invoice');
        expect(response.status).toBe(200);
    });

    it('should route to dashboard', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.status).toBe(200);
    });
});