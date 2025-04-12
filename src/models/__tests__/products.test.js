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
            productImage: 'image.png',
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
        expect(product.productName).toBe(productData.productName);
        expect(product.category).toBe(productData.category);
    });

    it('should not create a product without required fields', async () => {
        const productData = {
            productImage: 'image.png',
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 10,
            threshold: 5,
            stock: 20
        };
        await expect(ProductModel.create(productData)).rejects.toThrow();
    });

    it('should validate offerPer to be between 0 and 100', async () => {
        const productData = {
            productImage: 'image.png',
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 150,
            threshold: 5,
            stock: 20
        };
        await expect(ProductModel.create(productData)).rejects.toThrow('Discount percentage must be between 0 and 100');
    });
});