import mongoose from 'mongoose';
import { UserModel } from '../user.js';

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a user with valid data', async () => {
        const user = new UserModel({
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            email: 'john.doe@example.com',
            mobileNumber: 1234567890,
            role: ['user']
        });
        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.firstName).toBe('John');
        expect(savedUser.email).toBe('john.doe@example.com');
    });

    it('should not create a user without required fields', async () => {
        const user = new UserModel({
            lastName: 'Doe'
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.firstName).toBeDefined();
        expect(error.errors.password).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.mobileNumber).toBeDefined();
    });

    it('should validate email format', () => {
        expect(UserModel.schema.path('email').validate.validator('invalid-email')).toBe(false);
        expect(UserModel.schema.path('email').validate.validator('valid.email@example.com')).toBe(true);
    });
});