import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

describe('Database Connection', () => {
    it('should connect to the database with the correct URL', () => {
        const dbUrl = 'mongodb://localhost:27017/test';
        process.env.DB_URL = dbUrl;
        require('./index');
        expect(mongoose.connect).toHaveBeenCalledWith(dbUrl);
    });
});