import request from 'supertest';
import express from 'express';
import userRouter from '../src/routes/user.js';

const app = express();
app.use(express.json());
app.use(userRouter);

describe('User Routes', () => {
    it('should sign in a user', async () => {
        const response = await request(app)
            .post('/signin')
            .send({ username: 'testuser', password: 'testpass' });
        expect(response.status).toBe(200);
        // Add more assertions based on expected response
    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'testpass' });
        expect(response.status).toBe(200);
        // Add more assertions based on expected response
    });
});