import request from 'supertest';
import app from '../../app'; // Assuming you have an app.js file that exports your Express app
import BrandModel from '../../models/brand';

jest.mock('../../utils/cloudinaryServices.js'); // Mock cloudinary services

describe('Brand Controller', () => {
  afterEach(async () => {
    await BrandModel.deleteMany(); // Clean up the database after each test
  });

  describe('POST /brands', () => {
    it('should add a brand', async () => {
      const response = await request(app)
        .post('/brands')
        .send({ brandName: 'Test Brand', brandImage: 'image_url' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.brandName).toBe('Test Brand');
    });

    it('should return 500 on error', async () => {
      const response = await request(app)
        .post('/brands')
        .send({}); // Missing brandName

      expect(response.status).toBe(500);
    });
  });

  describe('GET /brands', () => {
    it('should fetch all brands', async () => {
      await BrandModel.create({ brandName: 'Test Brand' });

      const response = await request(app).get('/brands');

      expect(response.status).toBe(200);
      expect(response.body.brands).toHaveLength(1);
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
    it('should update a brand', async () => {
      const brand = await BrandModel.create({ brandName: 'Old Brand' });

      const response = await request(app)
        .put('/brands')
        .send({ _id: brand._id, updatedName: 'Updated Brand' });

      expect(response.status).toBe(200);
      expect(response.body.updatedBrand.brandName).toBe('Updated Brand');
    });

    it('should return 404 if brand not found', async () => {
      const response = await request(app)
        .put('/brands')
        .send({ _id: 'nonexistent_id' });

      expect(response.status).toBe(404);
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

    it('should return 400 if no ID provided', async () => {
      const response = await request(app).delete('/brands');

      expect(response.status).toBe(400);
    });
  });
});