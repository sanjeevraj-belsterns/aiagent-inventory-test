import { commonUploadMiddleware } from '../uploadFile';
import express from 'express';
import multer from 'multer';

jest.mock('multer');

const mockNext = jest.fn();
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

describe('commonUploadMiddleware', () => {
    let req;

    beforeEach(() => {
        req = {};
        multer.mockImplementation(() => ({
            any: jest.fn().mockImplementation((cb) => cb(null)),
        }));
    });

    it('should call next middleware when form data is parsed successfully', () => {
        commonUploadMiddleware(req, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 status and error message when there is an error', () => {
        multer.mockImplementation(() => ({
            any: jest.fn().mockImplementation((cb) => cb(new Error('Parse error'))),
        }));
        commonUploadMiddleware(req, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to parse form data' });
    });
});