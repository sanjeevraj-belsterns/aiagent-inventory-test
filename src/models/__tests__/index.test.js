import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('Mongoose Connection', () => {
    beforeAll(async () => {
        await mongoose.connect(`${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should connect to the database', async () => {
        const connectionState = mongoose.connection.readyState;
        expect(connectionState).toBe(1); // 1 means connected
    });
});