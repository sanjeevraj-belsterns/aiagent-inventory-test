import express from 'express'
import UserController from '../controllers/user.js'
import multer from 'multer'

const router = express.Router()

router.post('/signin' , multer().none() , UserController.signIn)
router.post('/login' ,multer().none(), UserController.logIn)


export default router

