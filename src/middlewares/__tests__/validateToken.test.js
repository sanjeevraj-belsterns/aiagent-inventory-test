import Validate from '../validateToken.js';
import { createRequest, createResponse } from 'node-mocks-http';
import ts from '../../utils/tokenServices.js';

jest.mock('../../utils/tokenServices.js');

describe('Validate Middleware', () => {
    it('should call next() if token is valid', async () => {
        const req = createRequest({
            headers: { authorization: 'Bearer validToken' }
        });
        const res = createResponse();
        const next = jest.fn();

        ts.verifyToken.mockResolvedValueOnce({});

        await Validate(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 402 if token is not found', async () => {
        const req = createRequest({ headers: {} });
        const res = createResponse();
        const next = jest.fn();

        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Token Not Found' });
    });

    it('should return 402 if token is expired', async () => {
        const req = createRequest({
            headers: { authorization: 'Bearer expiredToken' }
        });
        const res = createResponse();
        const next = jest.fn();

        ts.verifyToken.mockRejectedValueOnce(new Error('jwt expired'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Plese LogIn!' });
    });

    it('should return 500 for other errors', async () => {
        const req = createRequest({
            headers: { authorization: 'Bearer invalidToken' }
        });
        const res = createResponse();
        const next = jest.fn();

        ts.verifyToken.mockRejectedValueOnce(new Error('some other error'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toEqual({ message: 'Internal Server Error' });
    });
});