import { commonUploadMiddleware } from '../uploadFile';
import httpMocks from 'node-mocks-http';
import multer from 'multer';

jest.mock('multer');

describe('commonUploadMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should call next() when form data is parsed successfully', () => {
        multer.mockImplementation(() => ({
            any: () => (req, res, cb) => cb(null)
        }));

        commonUploadMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 400 and error message when parsing fails', () => {
        const error = new Error('Parsing error');
        multer.mockImplementation(() => ({
            any: () => (req, res, cb) => cb(error)
        }));

        commonUploadMiddleware(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ error: 'Failed to parse form data' });
    });
});