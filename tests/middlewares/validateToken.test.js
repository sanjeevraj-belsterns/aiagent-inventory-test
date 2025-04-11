import Validate from '../src/middlewares/validateToken.js';
import ts from '../src/utils/tokenServices.js';
import express from 'express';
import request from 'supertest';

jest.mock('../src/utils/tokenServices.js');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.headers.authorization = 'Bearer token';
    next();
});
app.get('/test', Validate, (req, res) => {
    res.status(200).send({ message: 'Success' });
});

describe('Validate Middleware', () => {
    it('should call next if token is valid', async () => {
        ts.verifyToken.mockResolvedValueOnce({});
        const response = await request(app).get('/test');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('should return 402 if token is not found', async () => {
        app.use((req, res, next) => {
            req.headers.authorization = undefined;
            next();
        });
        const response = await request(app).get('/test');
        expect(response.status).toBe(402);
        expect(response.body.message).toBe('Token Not Found');
    });

    it('should return 402 if token is expired', async () => {
        ts.verifyToken.mockRejectedValueOnce(new Error('jwt expired'));
        const response = await request(app).get('/test');
        expect(response.status).toBe(402);
        expect(response.body.message).toBe('Plese LogIn!');
    });

    it('should return 500 for other errors', async () => {
        ts.verifyToken.mockRejectedValueOnce(new Error('some other error'));
        const response = await request(app).get('/test');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});