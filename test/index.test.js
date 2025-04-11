import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppRoutes from '../src/routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(AppRoutes);

describe('Server', () => {
    it('should respond with 200 on root path', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});