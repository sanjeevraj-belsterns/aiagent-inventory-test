import request from 'supertest';
import app from '../../app'; // Assuming you have an app.js file that initializes your Express app
import BrandModel from '../../models/brand';

jest.mock('../../models/brand');
jest.mock('../../utils/cloudinaryServices.js');

describe('Brand Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addBrand', () => {
    it('should add a brand and return it', async () => {
      const brandData = { brandName: 'Test Brand', brandImage: 'image_url' };
      BrandModel.create.mockResolvedValue(brandData);

      const response = await request(app)
        .post('/api/brands')
        .send(brandData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(brandData);
    });

    it('should return 500 on error', async () => {
      BrandModel.create.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .post('/api/brands')
        .send({ brandName: 'Test Brand' });

      expect(response.status).toBe(500);
    });
  });

  describe('getAllBrand', () => {
    it('should return all brands', async () => {
      const brands = [{ brandName: 'Brand 1' }, { brandName: 'Brand 2' }];
      BrandModel.find.mockResolvedValue(brands);

      const response = await request(app)
        .get('/api/brands');

      expect(response.status).toBe(200);
      expect(response.body.brands).toEqual(brands);
    });

    it('should return 500 on error', async () => {
      BrandModel.find.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .get('/api/brands');

      expect(response.status).toBe(500);
    });
  });

  describe('updateBrand', () => {
    it('should update a brand and return it', async () => {
      const updatedBrand = { _id: '1', brandName: 'Updated Brand' };
      BrandModel.findById.mockResolvedValue(updatedBrand);
      BrandModel.findByIdAndUpdate.mockResolvedValue(updatedBrand);

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1', updatedName: 'Updated Brand' });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand).toEqual(updatedBrand);
    });

    it('should return 404 if brand not found', async () => {
      BrandModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Brand not found' });
    });

    it('should return 500 on error', async () => {
      BrandModel.findById.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .put('/api/brands')
        .send({ _id: '1' });

      expect(response.status).toBe(500);
    });
  });

  describe('deleteBrand', () => {
    it('should delete a brand and return success message', async () => {
      const deletedBrand = { _id: '1' };
      BrandModel.findByIdAndDelete.mockResolvedValue(deletedBrand);

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ _id: deletedBrand._id, message: 'Brand deleted successfully.' });
    });

    it('should return 404 if brand not found', async () => {
      BrandModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Brand not found.' });
    });

    it('should return 400 if no ID provided', async () => {
      const response = await request(app)
        .delete('/api/brands');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Brand ID is required.' });
    });

    it('should return 500 on error', async () => {
      BrandModel.findByIdAndDelete.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .delete('/api/brands?_id=1');

      expect(response.status).toBe(500);
    });
  });
});