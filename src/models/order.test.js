import mongoose from 'mongoose';\nimport OrderModel from './order.js';\n\ndescribe('Order Model', () => {\n    beforeAll(async () => {\n        await mongoose.connect('mongodb://localhost/test', {\n            useNewUrlParser: true,\n            useUnifiedTopology: true\n        });\n    });\n\n    afterAll(async () => {\n        await mongoose.connection.close();\n    });\n\n    it('should create a valid order', async () => {\n        const orderData = {\n            clientName: 'John Doe',\n            clientEmail: 'john@example.com',\n            clientContact: '1234567890',\n            clientAddress: '123 Main St',\n            orderDate: new Date(),\n            products: [{\n                id: new mongoose.Types.ObjectId(),\n                productName: 'Product 1',\n                quantity: 2,\n                offerPer: 10,\n                purchasePrice: 20,\n                retailPrice: 30,\n                total: 60\n            }],\n            netTotal: 60,\n            profit: 20\n        };\n\n        const order = new OrderModel(orderData);\n        const savedOrder = await order.save();\n        expect(savedOrder._id).toBeDefined();\n        expect(savedOrder.clientName).toBe(orderData.clientName);\n        expect(savedOrder.netTotal).toBe(orderData.netTotal);\n    });\n\n    it('should throw validation error if required fields are missing', async () => {\n        const orderData = {\n            clientName: 'John Doe',\n            clientEmail: 'john@example.com'\n            // Missing required fields\n        };\n\n        const order = new OrderModel(orderData);\n        let error;\n        try {\n            await order.save();\n        } catch (err) {\n            error = err;\n        }\n        expect(error).toBeDefined();\n        expect(error.name).toBe('ValidationError');\n    });\n});