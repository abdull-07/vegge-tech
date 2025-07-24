import express from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    checkAuthuser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    addAddress, getAddresses, updateAddress, deleteAddress,
    addToCart, updateCartItem, removeFromCart, getCart, clearCart
} from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";
import { checkDisposableEmailStrict, checkDisposableEmailLogin } from "../middlewares/disposableEmailMiddleware.js";

const router = express.Router();

// Authentication routes with disposable email protection
router.post('/register', checkDisposableEmailStrict, registerUser);
router.post('/login', checkDisposableEmailLogin, loginUser);
router.get('/logout', userAuth, logoutUser);
router.get('/check-auth', userAuth, checkAuthuser);

// Email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', checkDisposableEmailStrict, resendVerification);

// Password reset routes
router.post('/forgot-password', checkDisposableEmailStrict, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// User profile routes
router.put('/update-profile', userAuth, updateProfile);
router.put('/change-password', userAuth, changePassword);

// Address routes
router.post('/address', userAuth, addAddress);
router.get('/addresses', userAuth, getAddresses);
router.put('/address/:addressId', userAuth, updateAddress);
router.delete('/address/:addressId', userAuth, deleteAddress);

// Cart routes
router.post('/cart/add', userAuth, addToCart);
router.put('/cart/update', userAuth, updateCartItem);
router.delete('/cart/remove', userAuth, removeFromCart);
router.get('/cart', userAuth, getCart);
router.delete('/cart/clear', userAuth, clearCart);

export default router;
