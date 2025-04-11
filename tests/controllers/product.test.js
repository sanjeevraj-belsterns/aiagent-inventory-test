import request from 'supertest';
import app from '../../app';
import ProductModel from '../../src/models/products';

jest.mock('../../src/models/products');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const mockProduct = { productName: 'Test Product', brandId: '123', purchasePrice: 10, retailPrice: 15, stock: 100 };
      const mockResponse = { secure_url: 'http://example.com/image.jpg' };
      ProductModel.create.mockResolvedValue(mockProduct);
      cloudinary.uploader.upload = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/products')
        .send({
          productName: 'Test Product',
          productImage: 'image_data',
          category: 'Test Category',
          brandId: '123',
          purchasePrice: 10,
          retailPrice: 15,
          offerPer: 0,
          threshold: 10,
          stock: 100,
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully!');
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
      ProductModel.find.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products?brandId=123');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products?brandId=123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const mockProduct = { productName: 'Updated Product' };
      ProductModel.findOneAndUpdate.mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123', productName: 'Updated Product' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.product).toEqual(mockProduct);
    });

    it('should return 400 if product not found', async () => {
      ProductModel.findOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product not found!');
    });

    it('should return 500 on error', async () => {
      ProductModel.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/products')
        .send({ _id: '123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!!');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      ProductModel.findByIdAndDelete.mockResolvedValue({});

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully.');
    });

    it('should return 404 if product not found', async () => {
      ProductModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });

    it('should return 400 if no ID provided', async () => {
      const response = await request(app)
        .delete('/api/products');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Product ID is required.');
    });

    it('should return 500 on error', async () => {
      ProductModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/products?_id=123');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const mockInvoiceProducts = [{ _id: '1', productName: 'Product 1' }];
      ProductModel.find.mockResolvedValue(mockInvoiceProducts);

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockInvoiceProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const mockLowStockProducts = [{ _id: '1', productName: 'Low Stock Product' }];
      ProductModel.aggregate.mockResolvedValue(mockLowStockProducts);

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockLowStockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.aggregate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });
});