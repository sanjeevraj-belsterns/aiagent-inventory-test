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
        expect(product.stock).toBe(productData.stock);
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

    it('should not create a product with invalid offer percentage', async () => {
        const productData = {
            productImage: 'image.png',
            productName: 'Test Product 2',
            category: 'Test Category',
            brandId: new mongoose.Types.ObjectId(),
            purchasePrice: 100,
            retailPrice: 150,
            offerPer: 110,
            threshold: 5,
            stock: 20
        };
        await expect(ProductModel.create(productData)).rejects.toThrow();
    });
});