import mongoose from 'mongoose';
import OrderModel from '../order.js';

describe('Order Model', () => {
    it('should create a valid order', async () => {
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

        const order = new OrderModel(orderData);
        const savedOrder = await order.save();

        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.clientName).toBe(orderData.clientName);
        expect(savedOrder.clientEmail).toBe(orderData.clientEmail);
        expect(savedOrder.products.length).toBe(1);
    });

    it('should throw validation error if required fields are missing', async () => {
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

        const order = new OrderModel(orderData);
        let error;
        try {
            await order.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
});