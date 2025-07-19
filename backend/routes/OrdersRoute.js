import express from "express";
import { placeOrderCOD, getUserOrder, getSellerOrder, markOrderAsPaid } from "../controllers/ordersControllers.js";
import userAuth from "../middlewares/userAuth.js";
import sellerAuth from "../middlewares/sellerAuth.js";


const OrdersRoute = express.Router()
OrdersRoute.post('/cod', userAuth ,placeOrderCOD)
OrdersRoute.get('/user', userAuth ,getUserOrder)
OrdersRoute.get('/seller', sellerAuth ,getSellerOrder)
OrdersRoute.put('/mark-paid/:orderId', sellerAuth, markOrderAsPaid)

export default OrdersRoute

