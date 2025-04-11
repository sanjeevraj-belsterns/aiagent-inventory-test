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
      const reqBody = {
        productName: 'Test Product',
        productImage: 'image_url',
        category: 'Test Category',
        brandId: 'brand_id',
        purchasePrice: 100,
        retailPrice: 150,
        offerPer: 10,
        threshold: 5,
        stock: 20,
        description: 'Test Description',
      };

      const mockUpload = jest.fn().mockResolvedValue({ secure_url: 'uploaded_image_url' });
      jest.mock('../utils/cloudinaryServices.js', () => ({ uploader: { upload: mockUpload } }));

      const response = await request(app)
        .post('/api/products')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully!');
      expect(ProductModel.create).toHaveBeenCalledWith(expect.objectContaining({
        productName: 'Test Product',
        productImage: 'uploaded_image_url',
      }));
    });

    it('should return 500 on error', async () => {
      const reqBody = { productName: 'Test Product' };
      ProductModel.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/products')
        .send(reqBody);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const mockProducts = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
      ProductModel.find.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products?brandId=brand_id');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products?brandId=brand_id');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const reqBody = { _id: 'product_id', productName: 'Updated Product' };
      const mockProduct = { _id: 'product_id', productName: 'Updated Product' };
      ProductModel.findOneAndUpdate.mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/products')
        .send(reqBody);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.product).toEqual(mockProduct);
    });

    it('should return 400 if product not found', async () => {
      const reqBody = { _id: 'product_id' };
      ProductModel.findOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/products')
        .send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product not found!');
    });

    it('should return 500 on error', async () => {
      const reqBody = { _id: 'product_id' };
      ProductModel.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/products')
        .send(reqBody);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!!');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const reqQuery = { _id: 'product_id' };
      ProductModel.findByIdAndDelete.mockResolvedValue({});

      const response = await request(app)
        .delete('/api/products?_id=product_id');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully.');
    });

    it('should return 400 if product ID is not provided', async () => {
      const response = await request(app)
        .delete('/api/products');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Product ID is required.');
    });

    it('should return 404 if product not found', async () => {
      const reqQuery = { _id: 'product_id' };
      ProductModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/products?_id=product_id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });

    it('should return 500 on error', async () => {
      const reqQuery = { _id: 'product_id' };
      ProductModel.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/products?_id=product_id');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const mockProducts = [{ _id: '1', productName: 'Product 1' }];
      ProductModel.find.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
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