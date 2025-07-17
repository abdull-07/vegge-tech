import express from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    checkAuthuser, 
    verifyEmail, 
    resendVerification, 
    forgotPassword, 
    resetPassword 
} from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', userAuth, logoutUser);
router.get('/check-auth', userAuth, checkAuthuser);

// Email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
