import tokenServices from './tokenServices';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('tokenServices', () => {
    describe('hashPassword', () => {
        it('should hash the password', async () => {
            const password = 'password123';
            const salt = 'salt';
            const hash = 'hashedPassword';
            bcrypt.genSalt.mockResolvedValue(salt);
            bcrypt.hash.mockResolvedValue(hash);

            const result = await tokenServices.hashPassword(password);
            expect(result).toBe(hash);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
        });
    });

    describe('hashCompare', () => {
        it('should compare the password with the hash', async () => {
            const password = 'password123';
            const hash = 'hashedPassword';
            bcrypt.compare.mockResolvedValue(true);

            const result = await tokenServices.hashCompare(password, hash);
            expect(result).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
        });
    });

    describe('createToken', () => {
        it('should create a token', async () => {
            const payload = { userId: 1 };
            const token = 'token';
            process.env.JWT_SECRET = 'secret';
            process.env.JWT_EXPIRE = '1h';
            jwt.sign.mockResolvedValue(token);

            const result = await tokenServices.createToken(payload);
            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        });
    });

    describe('verifyToken', () => {
        it('should verify a token and return payload', async () => {
            const token = 'token';
            const payload = { userId: 1 };
            process.env.JWT_SECRET = 'secret';
            jwt.verify.mockResolvedValue(payload);

            const result = await tokenServices.verifyToken(token);
            expect(result).toBe(payload);
            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        });

        it('should throw an error if token verification fails', async () => {
            const token = 'invalidToken';
            const error = new Error('Invalid token');
            process.env.JWT_SECRET = 'secret';
            jwt.verify.mockImplementation(() => { throw error; });

            await expect(tokenServices.verifyToken(token)).rejects.toThrow(error);
        });
    });
});