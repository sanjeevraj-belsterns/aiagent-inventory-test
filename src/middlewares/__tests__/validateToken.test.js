import Validate from '../validateToken.js';
import ts from '../utils/tokenServices.js';
import httpMocks from 'node-mocks-http';
import { jest } from '@jest/globals';

jest.mock('../utils/tokenServices.js');

describe('Validate Middleware', () => {
    test('should call next() if token is valid', async () => {
        const req = httpMocks.createRequest({
            headers: { authorization: 'Bearer validToken' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        ts.verifyToken.mockResolvedValueOnce({});

        await Validate(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('should return 402 if token is not found', async () => {
        const req = httpMocks.createRequest({});
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Token Not Found' });
    });

    test('should return 402 if token is expired', async () => {
        const req = httpMocks.createRequest({
            headers: { authorization: 'Bearer expiredToken' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        ts.verifyToken.mockRejectedValueOnce(new Error('jwt expired'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Plese LogIn!' });
    });

    test('should return 500 for other errors', async () => {
        const req = httpMocks.createRequest({
            headers: { authorization: 'Bearer someToken' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        ts.verifyToken.mockRejectedValueOnce(new Error('some other error'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toEqual({ message: 'Internal Server Error' });
    });
});