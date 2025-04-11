import mongoose from './index.js';
import BrandModel from './brand.js';

describe('Brand Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a brand with valid data', async () => {
        const brand = new BrandModel({ brandImage: 'image.png', brandName: 'TestBrand' });
        const savedBrand = await brand.save();
        expect(savedBrand._id).toBeDefined();
        expect(savedBrand.brandName).toBe('TestBrand');
    });

    it('should not create a brand without a name', async () => {
        const brand = new BrandModel({ brandImage: 'image.png' });
        let error;
        try {
            await brand.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.brandName).toBeDefined();
    });

    it('should not create a brand with a name longer than 20 characters', async () => {
        const brand = new BrandModel({ brandImage: 'image.png', brandName: 'ThisBrandNameIsWayTooLong' });
        let error;
        try {
            await brand.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.brandName).toBeDefined();
    });
});