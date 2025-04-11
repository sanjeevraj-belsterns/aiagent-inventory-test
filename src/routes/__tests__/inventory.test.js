import request from 'supertest';
import express from 'express';
import inventoryRouter from '../inventory.js';

const app = express();
app.use(express.json());
app.use('/inventory', inventoryRouter);

describe('Inventory Routes', () => {
    it('should add a brand', async () => {
        const response = await request(app)
            .post('/inventory/addBrand')
            .set('Authorization', 'Bearer token')
            .attach('file', 'path/to/file.jpg')
            .send({ name: 'New Brand' });
        expect(response.status).toBe(201);
    });

    it('should get all brands', async () => {
        const response = await request(app)
            .get('/inventory/getAllBrands');
        expect(response.status).toBe(200);
    });

    it('should update a brand', async () => {
        const response = await request(app)
            .put('/inventory/updateBrand')
            .set('Authorization', 'Bearer token')
            .send({ id: 1, name: 'Updated Brand' });
        expect(response.status).toBe(200);
    });

    it('should delete a brand', async () => {
        const response = await request(app)
            .delete('/inventory/deleteBrand')
            .set('Authorization', 'Bearer token')
            .send({ id: 1 });
        expect(response.status).toBe(200);
    });

    it('should get products by brand id', async () => {
        const response = await request(app)
            .get('/inventory/getProductsByBrandId')
            .set('Authorization', 'Bearer token')
            .query({ brandId: 1 });
        expect(response.status).toBe(200);
    });

    it('should add a product', async () => {
        const response = await request(app)
            .post('/inventory/addProduct')
            .set('Authorization', 'Bearer token')
            .attach('file', 'path/to/file.jpg')
            .send({ name: 'New Product', brandId: 1 });
        expect(response.status).toBe(201);
    });

    it('should update a product', async () => {
        const response = await request(app)
            .put('/inventory/updateProduct')
            .set('Authorization', 'Bearer token')
            .send({ id: 1, name: 'Updated Product' });
        expect(response.status).toBe(200);
    });

    it('should delete a product', async () => {
        const response = await request(app)
            .delete('/inventory/deleteProduct')
            .set('Authorization', 'Bearer token')
            .send({ id: 1 });
        expect(response.status).toBe(200);
    });

    it('should get products for invoice', async () => {
        const response = await request(app)
            .get('/inventory/getProductsForInvoice');
        expect(response.status).toBe(200);
    });

    it('should get low stock products', async () => {
        const response = await request(app)
            .get('/inventory/getLowStockProducts');
        expect(response.status).toBe(200);
    });
});