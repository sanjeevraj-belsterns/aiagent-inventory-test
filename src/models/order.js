import mongoose from "./index.js";

const orderSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    clientContact: {
        type: String,
        required: true
    },
    clientAddress: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        offerPer: {
            type: Number,
            required: true
        },
        purchasePrice: {
            type: Number,
            required: true
        },
        retailPrice: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    netTotal: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    }
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
