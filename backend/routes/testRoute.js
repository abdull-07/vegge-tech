import express from "express";
import { testEmailService } from "../controllers/testController.js";

const router = express.Router();

// Test routes
router.post('/email', testEmailService);

export default router;