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
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/'); // Adjust the route as necessary
        expect(response.status).toBe(200);
    });

    it('should listen on the specified PORT', () => {
        expect(process.env.PORT).toBeDefined();
    });
});