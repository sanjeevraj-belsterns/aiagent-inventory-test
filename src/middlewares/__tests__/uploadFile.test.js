import { commonUploadMiddleware } from '../uploadFile';
import express from 'express';
import multer from 'multer';

jest.mock('multer');

const app = express();
const mockRequest = (body = {}, files = []) => ({
    body,
    files,
});
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const nextFunction = jest.fn();

describe('commonUploadMiddleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() when form data is parsed successfully', () => {
        multer.mockImplementation(() => ({
            any: () => (req, res, cb) => cb(null),
        }));

        const req = mockRequest();
        const res = mockResponse();

        commonUploadMiddleware(req, res, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 status and error message when parsing fails', () => {
        const error = new Error('Parsing error');
        multer.mockImplementation(() => ({
            any: () => (req, res, cb) => cb(error),
        }));

        const req = mockRequest();
        const res = mockResponse();

        commonUploadMiddleware(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to parse form data' });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});