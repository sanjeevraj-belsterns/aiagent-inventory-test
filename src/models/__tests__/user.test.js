import mongoose from 'mongoose';
import { UserModel } from '../user.js';

describe('User Model', () => {
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
    });

    it('should not create a user without firstName', async () => {
        const user = new UserModel({
            lastName: 'Doe',
            password: 'password123',
            email: 'john.doe@example.com',
            mobileNumber: 1234567890
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.firstName).toBeDefined();
    });

    it('should not create a user with invalid email', async () => {
        const user = new UserModel({
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            email: 'invalid-email',
            mobileNumber: 1234567890
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
    });

    it('should not create a user without password', async () => {
        const user = new UserModel({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            mobileNumber: 1234567890
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.password).toBeDefined();
    });
});