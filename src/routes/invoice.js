import express from 'express'
import multer from 'multer';

import OrderController from "../controllers/orders.js"
import TokenValidation from "../middlewares/validateToken.js"

const router = express.Router();
router.post('/addOrder' , multer().none() , TokenValidation , OrderController.addOrder)
router.get('/orderReport' , TokenValidation , OrderController.todayOrderReport)
router.get('/monthlySalesAndProfitReport' , TokenValidation , OrderController.monthlySalesAndProfitReport)
router.get('/getDashBoardData' , OrderController.getDashboardData)

export default router