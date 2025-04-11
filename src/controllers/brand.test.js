import request from 'supertest';
import app from '../app';
import BrandModel from '../models/brand';
import mongoose from 'mongoose';

jest.mock('../utils/cloudinaryServices.js');

describe('Brand Controller', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /brands', () => {
    it('should add a brand', async () => {
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_url' });

      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
    });
  });

  describe('GET /brands', () => {
    it('should fetch all brands', async () => {
      const response = await request(app).get('/brands');
      expect(response.status).toBe(200);
      expect(response.body.brands).toBeDefined();
    });
  });

  describe('PUT /brands', () => {
    it('should update a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Brand' });
      const response = await request(app)
        .put('/brands')
        .send({ _id: brand._id, updatedName: 'Updated Brand' });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('Updated Brand');
    });
  });

  describe('DELETE /brands', () => {
    it('should delete a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Brand to Delete' });
      const response = await request(app).delete(`/brands?_id=${brand._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Brand deleted successfully.');
    });
  });
});