import userController from '../user.js';
import { UserModel } from '../../models/user.js';
import ts from '../../utils/tokenServices.js';

jest.mock('../../models/user.js');
jest.mock('../../utils/tokenServices.js');

describe('User Controller', () => {
  describe('signIn', () => {
    it('should create a new user if the user does not exist', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      UserModel.findOne.mockResolvedValue(null);
      ts.hashPassword.mockResolvedValue('hashedPassword');
      UserModel.create.mockResolvedValue({});

      await userController.signIn(req, res);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(ts.hashPassword).toHaveBeenCalledWith(req.body.password);
      expect(UserModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'User signIn succssful!' });
    });

    it('should return an error if the user already exists', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      UserModel.findOne.mockResolvedValue({});

      await userController.signIn(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: `User with ${req.body.email} already exists!` });
    });

    it('should handle errors', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      UserModel.findOne.mockRejectedValue(new Error('Database error'));

      await userController.signIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('logIn', () => {
    it('should log in the user with correct credentials', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const user = { firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'hashedPassword', _id: '1', role: 'user' };
      UserModel.findOne.mockResolvedValue(user);
      ts.hashCompare.mockResolvedValue(true);
      ts.createToken.mockResolvedValue('token');

      await userController.logIn(req, res);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(ts.hashCompare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(ts.createToken).toHaveBeenCalledWith({ firstName: user.firstName, lastName: user.lastName, email: user.email, id: user._id, role: user.role });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Login Successful', user, token: 'token' });
    });

    it('should return an error for incorrect password', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongPassword' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const user = { password: 'hashedPassword' };
      UserModel.findOne.mockResolvedValue(user);
      ts.hashCompare.mockResolvedValue(false);

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Incorrect Username or password!' });
    });

    it('should return an error if user not found', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      UserModel.findOne.mockResolvedValue(null);

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle errors', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      UserModel.findOne.mockRejectedValue(new Error('Database error'));

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});