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
            .send({ name: 'New Brand' })
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should get all brands', async () => {
        const response = await request(app)
            .get('/inventory/getAllBrands');
        expect(response.status).toBe(200);
    });

    it('should update a brand', async () => {
        const response = await request(app)
            .put('/inventory/updateBrand')
            .send({ id: 1, name: 'Updated Brand' })
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should delete a brand', async () => {
        const response = await request(app)
            .delete('/inventory/deleteBrand')
            .send({ id: 1 })
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should get products by brand id', async () => {
        const response = await request(app)
            .get('/inventory/getProductsByBrandId?id=1')
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should add a product', async () => {
        const response = await request(app)
            .post('/inventory/addProduct')
            .send({ name: 'New Product', brandId: 1 })
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should update a product', async () => {
        const response = await request(app)
            .put('/inventory/updateProduct')
            .send({ id: 1, name: 'Updated Product' })
            .set('Authorization', 'Bearer valid_token');
        expect(response.status).toBe(200);
    });

    it('should delete a product', async () => {
        const response = await request(app)
            .delete('/inventory/deleteProduct')
            .send({ id: 1 })
            .set('Authorization', 'Bearer valid_token');
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