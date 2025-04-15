import request from 'supertest';
import app from '../../app'; // Assuming you have an app.js file that exports your Express app
import ProductModel from '../../models/products';

jest.mock('../../models/products');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const mockProduct = { productName: 'Test Product', category: 'Test Category', brandId: '123', purchasePrice: 100, retailPrice: 150, offerPer: 10, threshold: 5, stock: 20, description: 'Test Description' };
      const mockImageUpload = { secure_url: 'http://example.com/image.jpg' };
      cloudinary.uploader.upload = jest.fn().mockResolvedValue(mockImageUpload);
      ProductModel.create = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/products')
        .send({ ...mockProduct, productImage: 'imageData' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully!');
      expect(ProductModel.create).toHaveBeenCalledWith({ ...mockProduct, productImage: mockImageUpload.secure_url });
    });

    it('should return 500 on error', async () => {
      cloudinary.uploader.upload = jest.fn().mockRejectedValue(new Error('Upload failed'));

      const response = await request(app)
        .post('/api/products')
        .send({ productName: 'Test Product' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const mockProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find = jest.fn().mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products?brandId=123');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.find = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      const response = await request(app)
        .get('/api/products?brandId=123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const mockProduct = { _id: '123', productName: 'Updated Product' };
      ProductModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123', productName: 'Updated Product' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.product).toEqual(mockProduct);
    });

    it('should return 400 if product not found', async () => {
      ProductModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product not found!');
    });

    it('should return 500 on error', async () => {
      ProductModel.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!!');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      ProductModel.findByIdAndDelete = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully.');
    });

    it('should return 400 if product ID is missing', async () => {
      const response = await request(app)
        .delete('/api/products');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Product ID is required.');
    });

    it('should return 404 if product not found', async () => {
      ProductModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });

    it('should return 500 on error', async () => {
      ProductModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Delete failed'));

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const mockInvoiceProducts = [{ _id: '1', productName: 'Product 1' }];
      ProductModel.find = jest.fn().mockResolvedValue(mockInvoiceProducts);

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockInvoiceProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.find = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const mockLowStockProducts = [{ _id: '1', productName: 'Low Stock Product' }];
      ProductModel.aggregate = jest.fn().mockResolvedValue(mockLowStockProducts);

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockLowStockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.aggregate = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });
});