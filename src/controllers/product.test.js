import request from 'supertest';
import app from '../app'; // Assuming you have an Express app
import ProductModel from '../models/products';

jest.mock('../models/products');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const req = {
        body: {
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
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      ProductModel.create.mockResolvedValue(req.body);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product added successfully!' });
    });

    it('should return 500 on error', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      ProductModel.create.mockRejectedValue(new Error('Error'));

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const req = { query: { _id: 'brand_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      const mockProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find.mockResolvedValue(mockProducts);

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should return 500 on error', async () => {
      const req = { query: { _id: 'brand_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      ProductModel.find.mockRejectedValue(new Error('Error'));

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // Additional tests for updateProduct, deleteProduct, getProductsForInvoice, and getLowStockProducts would follow a similar structure.
});