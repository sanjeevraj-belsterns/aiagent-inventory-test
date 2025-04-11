import mongoose from './index.js';
import OrderModel from './order.js';

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
            products: [
                {
                    id: new mongoose.Types.ObjectId(),
                    productName: 'Product 1',
                    quantity: 2,
                    offerPer: 10,
                    purchasePrice: 50,
                    retailPrice: 70,
                    total: 140
                }
            ],
            netTotal: 140,
            profit: 20
        };

        const order = await OrderModel.create(orderData);
        expect(order.clientName).toBe(orderData.clientName);
        expect(order.clientEmail).toBe(orderData.clientEmail);
        expect(order.products.length).toBe(1);
        expect(order.netTotal).toBe(orderData.netTotal);
        expect(order.profit).toBe(orderData.profit);
    });

    it('should throw validation error if required fields are missing', async () => {
        const orderData = {
            clientEmail: 'john@example.com',
            clientContact: '1234567890',
            clientAddress: '123 Main St',
            orderDate: new Date(),
            products: [],
            netTotal: 0,
            profit: 0
        };

        await expect(OrderModel.create(orderData)).rejects.toThrow();
    });
});