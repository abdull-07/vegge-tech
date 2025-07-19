import express from "express";
import { listVerificationTokens, manuallyVerifyUser } from "../controllers/devController.js";

const router = express.Router();

// Development-only routes - these should be disabled in production
router.get('/verification-tokens', listVerificationTokens);
router.post('/verify-user', manuallyVerifyUser);

export default router;