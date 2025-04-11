import request from 'supertest';
import app from '../app';
import BrandModel from '../models/brand';
import cloudinary from '../utils/cloudinaryServices';

jest.mock('../utils/cloudinaryServices');

describe('Brand Controller', () => {
  afterEach(async () => {
    await BrandModel.deleteMany();
  });

  describe('POST /brands', () => {
    it('should add a brand with image', async () => {
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/image.jpg' });
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });
      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
      expect(response.body.brandImage).toBe('http://example.com/image.jpg');
    });

    it('should add a brand without image', async () => {
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand' });
      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
      expect(response.body.brandImage).toBeNull();
    });
  });

  describe('GET /brands', () => {
    it('should fetch all brands', async () => {
      await BrandModel.create({ brandName: 'Test Brand' });
      const response = await request(app).get('/brands');
      expect(response.status).toBe(200);
      expect(response.body.brands.length).toBe(1);
      expect(response.body.brands[0].brandName).toBe('Test Brand');
    });
  });

  describe('PUT /brands', () => {
    it('should update a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Brand' });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/newimage.jpg' });
      const response = await request(app)
        .put('/brands')
        .send({ _id: brand._id, updatedName: 'New Brand', file: { path: 'new_image_data' } });
      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('New Brand');
      expect(response.body.updatedBrand.brandImage).toBe('http://example.com/newimage.jpg');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app)
        .put('/brands')
        .send({ _id: 'nonexistent_id', updatedName: 'New Brand' });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found');
    });
  });

  describe('DELETE /brands', () => {
    it('should delete a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Brand to delete' });
      const response = await request(app)
        .delete('/brands?_id=' + brand._id);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Brand deleted successfully.');
    });

    it('should return 400 if no ID is provided', async () => {
      const response = await request(app).delete('/brands');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Brand ID is required.');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app).delete('/brands?_id=nonexistent_id');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found.');
    });
  });
});