import express from 'express';
import { createJazzCashPayment, createEasyPaisaPayment, verifyJazzCashPayment, verifyEasyPaisaPayment } from '../controllers/paymentControllers.js';
const paymentRouter = express.Router();

// JazzCash routes
paymentRouter.post('/jazzcash', createJazzCashPayment); // /api/payment/jazzcash
paymentRouter.post('/jazzcash/verify', verifyJazzCashPayment);

// Easypaisa routes
paymentRouter.post('/easypaisa', createEasyPaisaPayment);
paymentRouter.post('/easypaisa/verify', verifyEasyPaisaPayment);


export default paymentRouter;
