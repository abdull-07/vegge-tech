import express from "express";
import { loginUser, logoutUser, registerUser, checkAuthuser } from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', userAuth, logoutUser);
router.get('/check-auth', userAuth, checkAuthuser);

export default router;
