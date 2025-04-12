import request from 'supertest';
import app from '../../app';
import BrandModel from '../../models/brand';

jest.mock('../../models/brand');
jest.mock('../utils/cloudinaryServices.js');

describe('Brand Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addBrand', () => {
    it('should add a brand and return it', async () => {
      const mockBrand = { _id: '1', brandName: 'Test Brand', brandImage: 'http://test.com/image.jpg' };
      BrandModel.create.mockResolvedValue(mockBrand);

      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_data' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockBrand);
    });

    it('should return 500 if an error occurs', async () => {
      BrandModel.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand' });

      expect(response.status).toBe(500);
    });
  });

  describe('getAllBrand', () => {
    it('should return all brands', async () => {
      const mockBrands = [{ _id: '1', brandName: 'Test Brand' }];
      BrandModel.find.mockResolvedValue(mockBrands);

      const response = await request(app)
        .get('/api/brands');

      expect(response.status).toBe(200);
      expect(response.body.brands).toEqual(mockBrands);
    });

    it('should return 500 if an error occurs', async () => {
      BrandModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/brands');

      expect(response.status).toBe(500);
    });
  });

  describe('updateBrand', () => {
    it('should update a brand and return it', async () => {
      const mockBrand = { _id: '1', brandName: 'Updated Brand', brandImage: 'http://test.com/image.jpg' };
      BrandModel.findById.mockResolvedValue(mockBrand);
      BrandModel.findByIdAndUpdate.mockResolvedValue(mockBrand);

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1', updatedName: 'Updated Brand' });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand).toEqual(mockBrand);
    });

    it('should return 404 if brand not found', async () => {
      BrandModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1' });

      expect(response.status).toBe(404);
    });

    it('should return 500 if an error occurs', async () => {
      BrandModel.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1' });

      expect(response.status).toBe(500);
    });
  });

  describe('deleteBrand', () => {
    it('should delete a brand and return success message', async () => {
      const mockBrand = { _id: '1' };
      BrandModel.findByIdAndDelete.mockResolvedValue(mockBrand);

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ _id: mockBrand._id, message: 'Brand deleted successfully.' });
    });

    it('should return 400 if no ID is provided', async () => {
      const response = await request(app)
        .delete('/api/brands');

      expect(response.status).toBe(400);
    });

    it('should return 404 if brand not found', async () => {
      BrandModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(404);
    });

    it('should return 500 if an error occurs', async () => {
      BrandModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(500);
    });
  });
});