import userController from '../user.js';
import { UserModel } from '../../models/user.js';
import ts from '../../utils/tokenServices.js';

jest.mock('../../models/user.js');
jest.mock('../../utils/tokenServices.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { 
      status: jest.fn().mockReturnThis(), 
      send: jest.fn() 
    };
  });

  describe('signIn', () => {
    it('should create a new user if user does not exist', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      UserModel.findOne.mockResolvedValue(null);
      ts.hashPassword.mockResolvedValue('hashedPassword');

      await userController.signIn(req, res);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(ts.hashPassword).toHaveBeenCalledWith(req.body.password);
      expect(UserModel.create).toHaveBeenCalledWith({ email: req.body.email, password: 'hashedPassword' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'User signIn succssful!' });
    });

    it('should return an error if user already exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      UserModel.findOne.mockResolvedValue({});

      await userController.signIn(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: `User with ${req.body.email} already exists!` });
    });

    it('should handle errors', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      UserModel.findOne.mockRejectedValue(new Error('Database error'));

      await userController.signIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('logIn', () => {
    it('should log in a user with correct credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const user = { _id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'hashedPassword', role: 'user' };
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
      req.body = { email: 'test@example.com', password: 'wrongPassword' };
      const user = { _id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'hashedPassword' };
      UserModel.findOne.mockResolvedValue(user);
      ts.hashCompare.mockResolvedValue(false);

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Incorrect Username or password!' });
    });

    it('should return an error if user not found', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      UserModel.findOne.mockResolvedValue(null);

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    it('should handle errors', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      UserModel.findOne.mockRejectedValue(new Error('Database error'));

      await userController.logIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});