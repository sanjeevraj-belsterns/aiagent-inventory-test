import request from 'supertest';
import app from '../../app'; // Assuming you have an express app setup
import ProductModel from '../../models/products';

jest.mock('../../models/products');

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
        send: jest.fn(),
      };

      ProductModel.create.mockResolvedValue(req.body);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product added successfully!' });
    });

    it('should handle errors', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.create.mockRejectedValue(new Error('Error')); // Simulate error

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
        send: jest.fn(),
      };

      const products = [{ productName: 'Test Product' }];
      ProductModel.find.mockResolvedValue(products);

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: 'brand_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ProductModel.find.mockRejectedValue(new Error('Error'));

      await getProductsByBrandId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const req = { body: { _id: 'product_id', productName: 'Updated Product' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const updatedProduct = { _id: 'product_id', productName: 'Updated Product' };
      ProductModel.findOneAndUpdate.mockResolvedValue(updatedProduct);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product updated successfully', product: updatedProduct });
    });

    it('should handle product not found', async () => {
      const req = { body: { _id: 'product_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.findOneAndUpdate.mockResolvedValue(null);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Product not found!' });
    });

    it('should handle errors', async () => {
      const req = { body: { _id: 'product_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.findOneAndUpdate.mockRejectedValue(new Error('Error'));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!!' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const deletedProduct = { _id: 'product_id' };
      ProductModel.findByIdAndDelete.mockResolvedValue(deletedProduct);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully.' });
    });

    it('should return 400 if no product ID is provided', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required.' });
    });

    it('should return 404 if product not found', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ProductModel.findByIdAndDelete.mockResolvedValue(null);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    it('should handle errors', async () => {
      const req = { query: { _id: 'product_id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.findByIdAndDelete.mockRejectedValue(new Error('Error'));

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const invoiceProducts = [{ _id: '1', productName: 'Product 1' }];
      ProductModel.find.mockResolvedValue(invoiceProducts);

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: invoiceProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.find.mockRejectedValue(new Error('Error'));

      await getProductsForInvoice(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const lowStockProducts = [{ _id: '1', productName: 'Low Stock Product' }];
      ProductModel.aggregate.mockResolvedValue(lowStockProducts);

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ products: lowStockProducts });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      ProductModel.aggregate.mockRejectedValue(new Error('Error'));

      await getLowStockProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});