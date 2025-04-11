import request from 'supertest';
import app from '../../app'; // Assuming you have an Express app setup
import BrandModel from '../../models/brand';

jest.mock('../../models/brand');
jest.mock('../utils/cloudinaryServices.js', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({ secure_url: 'http://mocked-url.com/image.jpg' })
  }
}));

describe('Brand Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addBrand', () => {
    it('should add a brand and return it', async () => {
      const brandData = { brandName: 'Test Brand', brandImage: 'imageData' };
      BrandModel.create.mockResolvedValue(brandData);

      const response = await request(app)
        .post('/api/brands') // Adjust the endpoint as necessary
        .send(brandData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(brandData);
      expect(BrandModel.create).toHaveBeenCalledWith({
        brandName: 'Test Brand',
        brandImage: 'http://mocked-url.com/image.jpg'
      });
    });

    it('should handle errors', async () => {
      BrandModel.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('getAllBrand', () => {
    it('should return all brands', async () => {
      const brands = [{ brandName: 'Brand 1' }, { brandName: 'Brand 2' }];
      BrandModel.find.mockResolvedValue(brands);

      const response = await request(app)
        .get('/api/brands'); // Adjust the endpoint as necessary

      expect(response.status).toBe(200);
      expect(response.body.brands).toEqual(brands);
    });

    it('should handle errors', async () => {
      BrandModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/brands');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('updateBrand', () => {
    it('should update a brand and return it', async () => {
      const brandData = { _id: '123', updatedName: 'Updated Brand' };
      const updatedBrand = { brandName: 'Updated Brand', brandImage: 'http://mocked-url.com/image.jpg' };
      BrandModel.findById.mockResolvedValue(brandData);
      BrandModel.findByIdAndUpdate.mockResolvedValue(updatedBrand);

      const response = await request(app)
        .put('/api/brands') // Adjust the endpoint as necessary
        .send(brandData);

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand).toEqual(updatedBrand);
    });

    it('should return 404 if brand not found', async () => {
      BrandModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '123' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Brand not found');
    });

    it('should handle errors', async () => {
      BrandModel.findById.mockResolvedValue({});
      BrandModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '123' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('deleteBrand', () => {
    it('should delete a brand and return success message', async () => {
      const brandId = '123';
      BrandModel.findByIdAndDelete.mockResolvedValue({ _id: brandId });

      const response = await request(app)
        .delete('/api/brands?_id=' + brandId); // Adjust the endpoint as necessary

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ _id: brandId, message: 'Brand deleted successfully.' });
    });

    it('should return 400 if no ID is provided', async () => {
      const response = await request(app)
        .delete('/api/brands');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Brand ID is required.');
    });

    it('should return 404 if brand not found', async () => {
      const brandId = '123';
      BrandModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/brands?_id=' + brandId);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Brand not found.');
    });

    it('should handle errors', async () => {
      const brandId = '123';
      BrandModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/brands?_id=' + brandId);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
});