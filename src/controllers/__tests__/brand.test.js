import request from 'supertest';
import app from '../../app'; // Assuming you have an Express app
import BrandModel from '../../models/brand';
import cloudinary from '../../utils/cloudinaryServices';

jest.mock('../../utils/cloudinaryServices');

describe('Brand Controller', () => {
  afterEach(async () => {
    await BrandModel.deleteMany(); // Clean up the database after each test
  });

  describe('addBrand', () => {
    it('should add a brand with image', async () => {
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/image.jpg' });
      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });

      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand');
      expect(response.body.brandImage).toBe('http://example.com/image.jpg');
    });

    it('should add a brand without image', async () => {
      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand No Image' });

      expect(response.status).toBe(201);
      expect(response.body.brandName).toBe('Test Brand No Image');
      expect(response.body.brandImage).toBeNull();
    });

    it('should return 500 on error', async () => {
      cloudinary.uploader.upload.mockRejectedValue(new Error('Upload failed'));
      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });

      expect(response.status).toBe(500);
    });
  });

  describe('getAllBrand', () => {
    it('should return all brands', async () => {
      await BrandModel.create({ brandName: 'Brand 1' });
      await BrandModel.create({ brandName: 'Brand 2' });

      const response = await request(app).get('/api/brands');

      expect(response.status).toBe(200);
      expect(response.body.brands.length).toBe(2);
    });

    it('should return 500 on error', async () => {
      jest.spyOn(BrandModel, 'find').mockImplementationOnce(() => { throw new Error('Database error'); });
      const response = await request(app).get('/api/brands');

      expect(response.status).toBe(500);
    });
  });

  describe('updateBrand', () => {
    it('should update a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Name' });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://example.com/new_image.jpg' });

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: brand._id, updatedName: 'New Name', file: { path: 'new_image_data' } });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('New Name');
      expect(response.body.updatedBrand.brandImage).toBe('http://example.com/new_image.jpg');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app)
        .put('/api/brands')
        .send({ _id: 'nonexistent_id', updatedName: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found');
    });

    it('should return 500 on error', async () => {
      jest.spyOn(BrandModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Update failed'));
      const response = await request(app)
        .put('/api/brands')
        .send({ _id: 'some_id', updatedName: 'New Name' });

      expect(response.status).toBe(500);
    });
  });

  describe('deleteBrand', () => {
    it('should delete a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Brand to Delete' });
      const response = await request(app).delete('/api/brands?_id=' + brand._id);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Brand deleted successfully.');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app).delete('/api/brands?_id=nonexistent_id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Brand not found.');
    });

    it('should return 400 if no ID provided', async () => {
      const response = await request(app).delete('/api/brands');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Brand ID is required.');
    });
  });
});