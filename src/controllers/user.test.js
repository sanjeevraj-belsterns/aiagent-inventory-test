import userController from './user.js';
import { UserModel } from '../models/user.js';
import ts from '../utils/tokenServices.js';
import express from 'express';
import request from 'supertest';

jest.mock('../models/user.js');
jest.mock('../utils/tokenServices.js');

const app = express();
app.use(express.json());
app.post('/signin', userController.signIn);
app.post('/login', userController.logIn);

describe('User Controller', () => {
  describe('signIn', () => {
    it('should create a new user if email does not exist', async () => {
      UserModel.findOne.mockResolvedValue(null);
      ts.hashPassword.mockResolvedValue('hashedPassword');
      UserModel.create.mockResolvedValue({});

      const response = await request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User signIn succssful!');
    });

    it('should return an error if user already exists', async () => {
      UserModel.findOne.mockResolvedValue({});

      const response = await request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User with test@example.com already exists!');
    });
  });

  describe('logIn', () => {
    it('should log in a user with correct credentials', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword', firstName: 'Test', lastName: 'User', _id: '1', role: 'user' };
      UserModel.findOne.mockResolvedValue(user);
      ts.hashCompare.mockResolvedValue(true);
      ts.createToken.mockResolvedValue('token');

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login Successful');
      expect(response.body.user).toEqual(user);
      expect(response.body.token).toBe('token');
    });

    it('should return an error for incorrect password', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword' };
      UserModel.findOne.mockResolvedValue(user);
      ts.hashCompare.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Incorrect Username or password!');
    });

    it('should return an error if user not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({ email: 'notfound@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('User not found!');
    });
  });
});