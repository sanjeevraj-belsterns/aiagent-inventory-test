import mongoose from './index.js';
import { UserModel } from './user.js';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a user with valid data', async () => {
    const user = new UserModel({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
      mobileNumber: 1234567890,
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe('John');
    expect(savedUser.email).toBe('john.doe@example.com');
  });

  it('should not create a user without required fields', async () => {
    const user = new UserModel({
      lastName: 'Doe',
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

  it('should validate email format', async () => {
    const user = new UserModel({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'invalid-email',
      mobileNumber: 1234567890,
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
});