import request from 'supertest';
import app from '../../app'; // Assuming you have an Express app setup
import BrandModel from '../../src/models/brand';
import cloudinary from '../../src/utils/cloudinaryServices';

jest.mock('../../src/utils/cloudinaryServices');

describe('Brand Controller', () => {
  afterEach(async () => {
    await BrandModel.deleteMany(); // Clean up the database after each test
  });

  describe('POST /brands', () => {
    it('should add a new brand', async () => {
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/image.jpg' });
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });

      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
      expect(response.body.brandImage).toBe('http://example.com/image.jpg');
    });

    it('should return 500 on error', async () => {
      cloudinary.uploader.upload.mockRejectedValue(new Error('Upload error'));
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });

      expect(response.status).toBe(500);
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

    it('should return 500 on error', async () => {
      jest.spyOn(BrandModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await request(app).get('/brands');

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /brands', () => {
    it('should update an existing brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Name' });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/new_image.jpg' });
      const response = await request(app)
        .put('/brands')
        .send({ _id: brand._id, updatedName: 'New Name', file: { path: 'new_image_data' } });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('New Name');
      expect(response.body.updatedBrand.brandImage).toBe('http://example.com/new_image.jpg');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app)
        .put('/brands')
        .send({ _id: 'nonexistent_id', updatedName: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found');
    });
  });

  describe('DELETE /brands', () => {
    it('should delete a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Test Brand' });
      const response = await request(app).delete(`/brands?_id=${brand._id}`);

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