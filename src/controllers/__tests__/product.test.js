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
      const mockProduct = { productName: 'Test Product', category: 'Test Category', brandId: '123', purchasePrice: 100, retailPrice: 150, offerPer: 10, threshold: 5, stock: 20, description: 'Test Description' };
      const mockImage = 'image_url';
      const req = { body: { ...mockProduct, productImage: mockImage } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      cloudinary.uploader.upload = jest.fn().mockResolvedValue({ secure_url: mockImage });
      ProductModel.create = jest.fn().mockResolvedValue(mockProduct);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product added successfully!' });
    });

    it('should handle errors', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.create = jest.fn().mockRejectedValue(new Error('Error')); 

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find = jest.fn().mockResolvedValue(mockProducts);

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockProducts });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      ProductModel.find = jest.fn().mockRejectedValue(new Error('Error'));

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const req = { body: { _id: '123', productName: 'Updated Product' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockProduct = { _id: '123', productName: 'Updated Product' };
      ProductModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockProduct);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product updated successfully', product: mockProduct });
    });

    it('should return 400 if product not found', async () => {
      const req = { body: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product not found!' });
    });

    it('should handle errors', async () => {
      const req = { body: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Error'));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!!' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockDeletedProduct = { _id: '123' };
      ProductModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedProduct);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully.' });
    });

    it('should return 400 if product ID is not provided', async () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required.' });
    });

    it('should return 404 if product not found', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      ProductModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Error'));

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockInvoiceProducts = [{ _id: '1', productName: 'Product 1' }];
      ProductModel.find = jest.fn().mockResolvedValue(mockInvoiceProducts);

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockInvoiceProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.find = jest.fn().mockRejectedValue(new Error('Error'));

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockLowStockProducts = [{ _id: '1', productName: 'Low Stock Product' }];
      ProductModel.aggregate = jest.fn().mockResolvedValue(mockLowStockProducts);

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: mockLowStockProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      ProductModel.aggregate = jest.fn().mockRejectedValue(new Error('Error'));

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});