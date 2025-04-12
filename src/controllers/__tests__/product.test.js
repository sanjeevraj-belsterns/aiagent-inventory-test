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
      const req = { body: { productName: 'Test Product', productImage: 'image_url', category: 'Test Category', brandId: 'brand_id', purchasePrice: 100, retailPrice: 150, offerPer: 10, threshold: 5, stock: 50, description: 'Test Description' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.create.mockResolvedValue(req.body);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product added successfully!' });
    });

    it('should handle errors', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.create.mockRejectedValue(new Error('Error')); // Simulate error

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const req = { query: { _id: 'brand_id' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find.mockResolvedValue(mockProducts);

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: 'brand_id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ProductModel.find.mockRejectedValue(new Error('Error'));

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const req = { body: { _id: 'product_id', productName: 'Updated Product' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockProduct = { _id: 'product_id', productName: 'Updated Product' };
      ProductModel.findOneAndUpdate.mockResolvedValue(mockProduct);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product updated successfully', product: mockProduct });
    });

    it('should handle product not found', async () => {
      const req = { body: { _id: 'product_id' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.findOneAndUpdate.mockResolvedValue(null);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product not found!' });
    });

    it('should handle errors', async () => {
      const req = { body: { _id: 'product_id' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.findOneAndUpdate.mockRejectedValue(new Error('Error'));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!!' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockDeletedProduct = { _id: 'product_id' };
      ProductModel.findByIdAndDelete.mockResolvedValue(mockDeletedProduct);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully.' });
    });

    it('should handle product not found', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ProductModel.findByIdAndDelete.mockResolvedValue(null);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    it('should handle missing product ID', async () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required.' });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.findByIdAndDelete.mockRejectedValue(new Error('Error'));

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockInvoiceProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find.mockResolvedValue(mockInvoiceProducts);

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockInvoiceProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.find.mockRejectedValue(new Error('Error'));

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockLowStockProducts = [{ productName: 'Low Stock Product' }];
      ProductModel.aggregate.mockResolvedValue(mockLowStockProducts);

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockLowStockProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      ProductModel.aggregate.mockRejectedValue(new Error('Error'));

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});