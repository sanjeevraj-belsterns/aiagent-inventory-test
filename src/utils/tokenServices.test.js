import tokenServices from './tokenServices';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('tokenServices', () => {
    const password = 'password123';
    const hash = 'hashedPassword';
    const payload = { userId: 1 };
    const token = 'jwtToken';

    test('hashPassword should return a hashed password', async () => {
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue(hash);
        const result = await tokenServices.hashPassword(password);
        expect(result).toBe(hash);
    });

    test('hashCompare should return true for matching passwords', async () => {
        bcrypt.compare.mockResolvedValue(true);
        const result = await tokenServices.hashCompare(password, hash);
        expect(result).toBe(true);
    });

    test('createToken should return a token', async () => {
        jwt.sign.mockResolvedValue(token);
        const result = await tokenServices.createToken(payload);
        expect(result).toBe(token);
    });

    test('verifyToken should return payload for valid token', async () => {
        jwt.verify.mockResolvedValue(payload);
        const result = await tokenServices.verifyToken(token);
        expect(result).toBe(payload);
    });

    test('verifyToken should throw error for invalid token', async () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
        await expect(tokenServices.verifyToken(token)).rejects.toThrow('Invalid token');
    });
});