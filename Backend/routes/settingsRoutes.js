import express from 'express';
import { getUserSettings, updateUserSettings } from '../controllers/settingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserSettings);
router.put('/update', authMiddleware, updateUserSettings);

export default router;
