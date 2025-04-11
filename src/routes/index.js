import express from 'express'
import UserRoutes from './user.js'
import InventoryRoutes from "./inventory.js"
import InvoiceRoutes from "./invoice.js"

const router = express.Router()
router.use('/user',UserRoutes)
router.use('/inventory' , InventoryRoutes)
router.use('/invoice' , InvoiceRoutes)
router.use('/dashboard' , InvoiceRoutes)

export default router