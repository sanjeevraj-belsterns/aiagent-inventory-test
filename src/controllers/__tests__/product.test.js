import request from 'supertest';
import app from '../../app'; // Assuming you have an Express app
import ProductModel from '../../models/products';

jest.mock('../../models/products');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const mockProduct = { productName: 'Test Product', brandId: '123', purchasePrice: 10, retailPrice: 15, stock: 100 };
      const mockImageUrl = 'http://example.com/image.jpg';
      const req = { body: { ...mockProduct, productImage: 'imageData' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      cloudinary.uploader.upload = jest.fn().mockResolvedValue({ secure_url: mockImageUrl });
      ProductModel.create = jest.fn().mockResolvedValue(mockProduct);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product added successfully!' });
    });

    it('should return 500 on error', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockProducts = [{ productName: 'Test Product' }];

      ProductModel.find = jest.fn().mockResolvedValue(mockProducts);

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should return 500 on error', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ProductModel.find = jest.fn().mockRejectedValue(new Error('Database error'));

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // Additional tests for updateProduct, deleteProduct, getProductsForInvoice, and getLowStockProducts would follow a similar pattern.
});