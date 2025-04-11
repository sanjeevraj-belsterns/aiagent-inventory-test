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
            description: 'Test description'
        };

        const product = await ProductModel.create(productData);
        expect(product).toHaveProperty('_id');
        expect(product.productName).toBe(productData.productName);
    });

    it('should not create a product without required fields', async () => {
        const productData = {
            productImage: 'image.jpg',
            // productName is missing
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            stock: 20,
            threshold: 5
        };

        await expect(ProductModel.create(productData)).rejects.toThrow();
    });

    it('should validate offerPer between 0 and 100', async () => {
        const productData = {
            productImage: 'image.jpg',
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            stock: 20,
            threshold: 5,
            offerPer: 150 // Invalid offer percentage
        };

        await expect(ProductModel.create(productData)).rejects.toThrow();
    });
});