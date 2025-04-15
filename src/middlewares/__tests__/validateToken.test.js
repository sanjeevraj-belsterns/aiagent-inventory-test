import Validate from '../validateToken.js';
import ts from '../../utils/tokenServices.js';

jest.mock('../../utils/tokenServices.js');

describe('Validate Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
    });

    it('should call next() if token is valid', async () => {
        req.headers.authorization = 'Bearer validToken';
        ts.verifyToken.mockResolvedValueOnce({});

        await Validate(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 402 if token is not found', async () => {
        await Validate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(402);
        expect(res.send).toHaveBeenCalledWith({ message: 'Token Not Found' });
    });

    it('should return 402 if token is expired', async () => {
        req.headers.authorization = 'Bearer expiredToken';
        ts.verifyToken.mockRejectedValueOnce(new Error('jwt expired'));

        await Validate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(402);
        expect(res.send).toHaveBeenCalledWith({ message: 'Plese LogIn!' });
    });

    it('should return 500 for other errors', async () => {
        req.headers.authorization = 'Bearer invalidToken';
        ts.verifyToken.mockRejectedValueOnce(new Error('some other error'));

        await Validate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
});