import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('Mongoose Connection', () => {
    it('should connect to the database', async () => {
        const connection = await mongoose.connection;
        expect(connection.readyState).toBe(1); // 1 means connected
    });
});