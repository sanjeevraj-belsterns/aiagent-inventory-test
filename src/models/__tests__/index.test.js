import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Mongoose Connection', () => {
    it('should connect to the database', async () => {
        const dbUrl = process.env.DB_URL;
        await mongoose.connect(dbUrl);
        expect(mongoose.connection.readyState).toBe(1);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});