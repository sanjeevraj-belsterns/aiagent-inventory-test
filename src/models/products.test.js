import mongoose from './index.js';
import ProductModel from './products.js';

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
            description: 'This is a test product',
        };
        const product = await ProductModel.create(productData);
        expect(product.productName).toBe('Test Product');
        expect(product.category).toBe('Test Category');
        expect(product.stock).toBe(20);
    });

    it('should not create a product without required fields', async () => {
        const productData = {
            productImage: 'image.jpg',
            // productName is required
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            threshold: 5,
            stock: 20,
        };
        await expect(ProductModel.create(productData)).rejects.toThrow();
    });

    it('should not create a product with invalid offer percentage', async () => {
        const productData = {
            productImage: 'image.jpg',
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 110, // Invalid offer percentage
            threshold: 5,
            stock: 20,
        };
        await expect(ProductModel.create(productData)).rejects.toThrow();
    });
});