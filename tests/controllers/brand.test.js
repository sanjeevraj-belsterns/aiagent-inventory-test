import request from 'supertest';
import app from '../../app';
import BrandModel from '../../models/brand';
import mongoose from 'mongoose';

jest.mock('../utils/cloudinaryServices.js');

describe('Brand Controller', () => {
  afterEach(async () => {
    await BrandModel.deleteMany();
  });

  describe('POST /addBrand', () => {
    it('should add a brand', async () => {
      const response = await request(app)
        .post('/addBrand')
        .send({ brandName: 'Test Brand', brandImage: 'image_url' });

      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
    });
  });

  describe('GET /getAllBrand', () => {
    it('should fetch all brands', async () => {
      await BrandModel.create({ brandName: 'Test Brand' });

      const response = await request(app).get('/getAllBrand');

      expect(response.status).toBe(200);
      expect(response.body.brands.length).toBe(1);
    });
  });

  describe('PUT /updateBrand', () => {
    it('should update a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Brand' });

      const response = await request(app)
        .put('/updateBrand')
        .send({ _id: brand._id, updatedName: 'Updated Brand' });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('Updated Brand');
    });
  });

  describe('DELETE /deleteBrand', () => {
    it('should delete a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Brand to Delete' });

      const response = await request(app)
        .delete('/deleteBrand?_id=' + brand._id);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Brand deleted successfully.');
    });
  });
});