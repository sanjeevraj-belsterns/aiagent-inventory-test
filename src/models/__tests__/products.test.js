import mongoose from 'mongoose';
import ProductModel from '../products.js';

describe('ProductModel', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a product with valid data', async () => {
        const product = new ProductModel({
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
        });
        const savedProduct = await product.save();
        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.productName).toBe('Test Product');
    });

    it('should not create a product without required fields', async () => {
        const product = new ProductModel({
            productImage: 'image.png',
            // productName is missing
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            stock: 20,
        });
        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.productName).toBeDefined();
    });

    it('should validate offerPer to be between 0 and 100', async () => {
        const product = new ProductModel({
            productImage: 'image.png',
            productName: 'Test Product 2',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 150, // Invalid offer percentage
            threshold: 5,
            stock: 20,
            description: 'Test Description'
        });
        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.offerPer).toBeDefined();
    });
});