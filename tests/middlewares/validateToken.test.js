import Validate from '../../src/middlewares/validateToken.js';
import ts from '../../src/utils/tokenServices.js';
import httpMocks from 'node-mocks-http';
import { jest } from '@jest/globals';

jest.mock('../../src/utils/tokenServices.js');

describe('Validate Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should call next() if token is valid', async () => {
        req.headers['authorization'] = 'Bearer validToken';
        ts.verifyToken.mockResolvedValueOnce({});

        await Validate(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 402 if token is not found', async () => {
        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Token Not Found' });
    });

    it('should return 402 if token is expired', async () => {
        req.headers['authorization'] = 'Bearer expiredToken';
        ts.verifyToken.mockRejectedValueOnce(new Error('jwt expired'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(402);
        expect(res._getData()).toEqual({ message: 'Plese LogIn!' });
    });

    it('should return 500 for other errors', async () => {
        req.headers['authorization'] = 'Bearer invalidToken';
        ts.verifyToken.mockRejectedValueOnce(new Error('some other error'));

        await Validate(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getData()).toEqual({ message: 'Internal Server Error' });
    });
});