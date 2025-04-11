import request from 'supertest';
import app from '../src/app';

describe('Inventory Routes', () => {
    it('should add a brand', async () => {
        const response = await request(app)
            .post('/addBrand')
            .set('Authorization', 'Bearer token')
            .attach('file', 'path/to/file.jpg')
            .send({ name: 'New Brand' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Brand added successfully');
    });

    it('should get all brands', async () => {
        const response = await request(app)
            .get('/getAllBrands');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should update a brand', async () => {
        const response = await request(app)
            .put('/updateBrand')
            .set('Authorization', 'Bearer token')
            .send({ id: 'brandId', name: 'Updated Brand' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Brand updated successfully');
    });

    it('should delete a brand', async () => {
        const response = await request(app)
            .delete('/deleteBrand')
            .set('Authorization', 'Bearer token')
            .send({ id: 'brandId' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Brand deleted successfully');
    });

    it('should get products by brand id', async () => {
        const response = await request(app)
            .get('/getProductsByBrandId')
            .set('Authorization', 'Bearer token')
            .query({ brandId: 'brandId' });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should add a product', async () => {
        const response = await request(app)
            .post('/addProduct')
            .set('Authorization', 'Bearer token')
            .attach('file', 'path/to/file.jpg')
            .send({ name: 'New Product', brandId: 'brandId' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Product added successfully');
    });

    it('should update a product', async () => {
        const response = await request(app)
            .put('/updateProduct')
            .set('Authorization', 'Bearer token')
            .send({ id: 'productId', name: 'Updated Product' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product updated successfully');
    });

    it('should delete a product', async () => {
        const response = await request(app)
            .delete('/deleteProduct')
            .set('Authorization', 'Bearer token')
            .send({ id: 'productId' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Product deleted successfully');
    });

    it('should get products for invoice', async () => {
        const response = await request(app)
            .get('/getProductsForInvoice');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get low stock products', async () => {
        const response = await request(app)
            .get('/getLowStockProducts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});