import express from "express";
import { placeOrderCOD, getUserOrder, getSellerOrder } from "../controllers/ordersControllers.js";
import userAuth from "../middlewares/userAuth.js";
import sellerAuth from "../middlewares/sellerAuth.js";


const OrdersRoute = express.Router()
OrdersRoute.post('/cod', userAuth ,placeOrderCOD)
OrdersRoute.get('/user', userAuth ,getUserOrder)
OrdersRoute.get('/seller', sellerAuth ,getSellerOrder)

export default OrdersRoute

