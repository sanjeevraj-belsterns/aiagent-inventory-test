import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Database Connection', () => {
    it('should connect to the database', async () => {
        const dbUrl = process.env.DB_URL;
        await mongoose.connect(dbUrl);
        expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});