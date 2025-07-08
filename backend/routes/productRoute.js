import express from 'express'
import { stoteUpload } from '../configs/multer.js'
import { addProduct, changeStock, getProduct, getSingleProduct } from '../controllers/productController.js'
import sellerAuth from '../middlewares/sellerAuth.js'

const productRoute = express.Router()
productRoute.post('/add', sellerAuth, stoteUpload.single('images'), addProduct)
productRoute.get('/all-products', getProduct)
productRoute.get('/:id', getSingleProduct)
productRoute.patch('/stock', sellerAuth, changeStock)

export default productRoute
