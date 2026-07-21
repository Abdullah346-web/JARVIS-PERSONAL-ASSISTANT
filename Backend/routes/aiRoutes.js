import express from 'express';
import { generateReply } from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/respond', authMiddleware, generateReply);

export default router;
