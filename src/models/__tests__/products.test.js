import mongoose from 'mongoose';
import ProductModel from '../products.js';

describe('Product Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a product with valid data', async () => {
        const productData = {
            productImage: 'image.jpg',
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 10,
            threshold: 5,
            stock: 20,
            description: 'Test Description'
        };

        const product = await ProductModel.create(productData);
        expect(product.productName).toBe('Test Product');
        expect(product.category).toBe('Test Category');
    });

    it('should throw an error if productName is missing', async () => {
        const productData = {
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            threshold: 5,
            stock: 20
        };

        await expect(ProductModel.create(productData)).rejects.toThrow('Product Name is required');
    });

    it('should throw an error if category is missing', async () => {
        const productData = {
            productName: 'Test Product',
            brandId: new mongoose.Types.ObjectId(),
            threshold: 5,
            stock: 20
        };

        await expect(ProductModel.create(productData)).rejects.toThrow('Category Name is required');
    });

    it('should throw an error if brandId is missing', async () => {
        const productData = {
            productName: 'Test Product',
            category: 'Test Category',
            threshold: 5,
            stock: 20
        };

        await expect(ProductModel.create(productData)).rejects.toThrow('BrandId is required');
    });

    it('should throw an error if stock is missing', async () => {
        const productData = {
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            threshold: 5
        };

        await expect(ProductModel.create(productData)).rejects.toThrow('Stock is required');
    });
});