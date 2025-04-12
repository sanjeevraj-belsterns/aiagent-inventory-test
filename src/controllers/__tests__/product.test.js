import request from 'supertest';
import app from '../../app'; // Assuming you have an app.js file that initializes your Express app
import ProductModel from '../models/products.js';

describe('Product Controller', () => {
  afterEach(async () => {
    await ProductModel.deleteMany(); // Clean up the database after each test
  });

  describe('POST /products', () => {
    it('should add a product successfully', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          productName: 'Test Product',
          productImage: 'image_url',
          category: 'Test Category',
          brandId: 'brand_id',
          purchasePrice: 100,
          retailPrice: 150,
          offerPer: 10,
          threshold: 5,
          stock: 20,
          description: 'Test Description'
        });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully!');
    });

    it('should return 500 if there is an error', async () => {
      const response = await request(app)
        .post('/products')
        .send({}); // Sending empty data to trigger an error
      expect(response.status).toBe(500);
    });
  });

  describe('GET /products', () => {
    it('should get products by brand ID', async () => {
      const product = await ProductModel.create({
        productName: 'Test Product',
        brandId: 'brand_id'
      });
      const response = await request(app)
        .get(`/products?_id=${product.brandId}`);
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(1);
    });

    it('should return 500 if there is an error', async () => {
      const response = await request(app)
        .get('/products?_id=invalid_id');
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /products', () => {
    it('should update a product successfully', async () => {
      const product = await ProductModel.create({
        productName: 'Old Product',
        brandId: 'brand_id'
      });
      const response = await request(app)
        .put('/products')
        .send({
          _id: product._id,
          productName: 'Updated Product'
        });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
    });

    it('should return 400 if product not found', async () => {
      const response = await request(app)
        .put('/products')
        .send({ _id: 'invalid_id' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product not found!');
    });
  });

  describe('DELETE /products', () => {
    it('should delete a product successfully', async () => {
      const product = await ProductModel.create({
        productName: 'Test Product',
        brandId: 'brand_id'
      });
      const response = await request(app)
        .delete('/products?_id=' + product._id);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully.');
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app)
        .delete('/products?_id=invalid_id');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });
  });

  describe('GET /products/low-stock', () => {
    it('should get low stock products', async () => {
      await ProductModel.create({
        productName: 'Low Stock Product',
        stock: 3,
        threshold: 5
      });
      const response = await request(app)
        .get('/products/low-stock');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(1);
    });
  });
});