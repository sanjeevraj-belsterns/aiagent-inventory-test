import mongoose from './index.js';
import ProductModel from './products.js';

describe('Product Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
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
            description: 'This is a test product'
        };
        const product = await ProductModel.create(productData);
        expect(product).toHaveProperty('_id');
        expect(product.productName).toBe(productData.productName);
    });

    it('should not create a product without required fields', async () => {
        const productData = {
            productImage: 'image.jpg',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            stock: 20
        };
        await expect(ProductModel.create(productData)).rejects.toThrow();
    });

    it('should validate offerPer to be between 0 and 100', async () => {
        const productData = {
            productImage: 'image.jpg',
            productName: 'Test Product',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            threshold: 5,
            stock: 20,
            offerPer: 150
        };
        await expect(ProductModel.create(productData)).rejects.toThrow('Discount percentage must be between 0 and 100');
    });
});