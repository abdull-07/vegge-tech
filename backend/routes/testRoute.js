import express from "express";
import { testEmailService, debugUserStatus, generateVerificationToken } from "../controllers/testController.js";

const router = express.Router();

// Test routes
router.post('/email', testEmailService);
router.post('/debug-user', debugUserStatus);
router.post('/generate-token', generateVerificationToken);

export default router;