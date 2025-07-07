import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

const addressRoute = express.Router()

addressRoute.post('/add', userAuth, addAddress)
addressRoute.get('/get', userAuth, getAddress)

export default addressRoute
