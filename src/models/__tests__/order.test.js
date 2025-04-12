import mongoose from 'mongoose';
import OrderModel from '../order.js';

describe('Order Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new order', async () => {
        const orderData = {
            clientName: 'John Doe',
            clientEmail: 'john@example.com',
            clientContact: '1234567890',
            clientAddress: '123 Main St',
            orderDate: new Date(),
            products: [{
                id: new mongoose.Types.ObjectId(),
                productName: 'Product 1',
                quantity: 2,
                offerPer: 10,
                purchasePrice: 20,
                retailPrice: 30,
                total: 60
            }],
            netTotal: 60,
            profit: 20
        };

        const order = await OrderModel.create(orderData);
        expect(order.clientName).toBe(orderData.clientName);
        expect(order.clientEmail).toBe(orderData.clientEmail);
        expect(order.products.length).toBe(1);
        expect(order.products[0].productName).toBe(orderData.products[0].productName);
    });

    it('should not create an order without required fields', async () => {
        const orderData = {
            clientName: '',
            clientEmail: '',
            clientContact: '',
            clientAddress: '',
            orderDate: null,
            products: [],
            netTotal: null,
            profit: null
        };

        await expect(OrderModel.create(orderData)).rejects.toThrow();
    });
});