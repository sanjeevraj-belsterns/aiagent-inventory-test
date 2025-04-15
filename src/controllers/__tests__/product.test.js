import request from 'supertest';
import app from '../../app';
import ProductModel from '../../models/products';

jest.mock('../../models/products');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const reqBody = { productName: 'Test Product', productImage: 'image_url', category: 'Test Category', brandId: 'brand_id', purchasePrice: 100, retailPrice: 150, offerPer: 10, threshold: 5, stock: 20, description: 'Test Description' };
      ProductModel.create.mockResolvedValue(reqBody);

      const response = await request(app)
        .post('/api/products')
        .send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully!');
    });

    it('should return 500 on error', async () => {
      ProductModel.create.mockRejectedValue(new Error('Error')); 

      const response = await request(app)
        .post('/api/products')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('getProductsByBrandId', () => {
    it('should return products by brand ID', async () => {
      const products = [{ productName: 'Test Product' }];
      ProductModel.find.mockResolvedValue(products);

      const response = await request(app)
        .get('/api/products?brandId=brand_id');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(products);
    });

    it('should return 500 on error', async () => {
      ProductModel.find.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .get('/api/products?brandId=brand_id');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const reqBody = { _id: 'product_id', productName: 'Updated Product' };
      const updatedProduct = { ...reqBody, productImage: 'image_url' };
      ProductModel.findOneAndUpdate.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put('/api/products')
        .send(reqBody);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.product).toEqual(updatedProduct);
    });

    it('should return 400 if product not found', async () => {
      ProductModel.findOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/products')
        .send({ _id: 'non_existing_id' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product not found!');
    });

    it('should return 500 on error', async () => {
      ProductModel.findOneAndUpdate.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .put('/api/products')
        .send({ _id: 'product_id' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!!');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
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
      ProductModel.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/products?_id=non_existing_id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });

    it('should return 500 on error', async () => {
      ProductModel.findByIdAndDelete.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .delete('/api/products?_id=product_id');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getProductsForInvoice', () => {
    it('should return products for invoice', async () => {
      const products = [{ _id: '1', productName: 'Test Product' }];
      ProductModel.find.mockResolvedValue(products);

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(products);
    });

    it('should return 500 on error', async () => {
      ProductModel.find.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .get('/api/products/invoice');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error!');
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const lowStockProducts = [{ _id: '1', productName: 'Low Stock Product' }];
      ProductModel.aggregate.mockResolvedValue(lowStockProducts);

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(lowStockProducts);
    });

    it('should return 500 on error', async () => {
      ProductModel.aggregate.mockRejectedValue(new Error('Error'));

      const response = await request(app)
        .get('/api/products/low-stock');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });
});