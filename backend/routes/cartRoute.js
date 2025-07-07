import express from "express";
import { updateCart } from "../controllers/cartController.js";
import userAuth from "../middlewares/userAuth.js";

const cartRoute = express.Router()
    cartRoute.post('/update', userAuth ,updateCart)


export default cartRoute
