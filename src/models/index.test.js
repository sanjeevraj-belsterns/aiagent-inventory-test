import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

test('should connect to the database', async () => {
    const dbUrl = 'mongodb://localhost:27017/test';
    process.env.DB_URL = dbUrl;
    await import('./index');
    expect(mongoose.connect).toHaveBeenCalledWith(dbUrl);
});