import request from 'supertest';
import express from 'express';
import userRouter from '../../src/routes/user.js';

const app = express();
app.use(express.json());
app.use('/api', userRouter);

describe('User Routes', () => {
    it('should sign in a user', async () => {
        const response = await request(app)
            .post('/api/signin')
            .send({ username: 'testuser', password: 'testpass' });
        expect(response.status).toBe(200);
    });

    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'testuser', password: 'testpass' });
        expect(response.status).toBe(200);
    });
});