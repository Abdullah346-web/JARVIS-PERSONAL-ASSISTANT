import express from 'express';
import {
  getAssistants,
  selectAssistant,
  getUserAssistant,
  updateAssistant,
} from '../controllers/assistantController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAssistants);
router.post('/select', authMiddleware, selectAssistant);
router.get('/my-assistant', authMiddleware, getUserAssistant);
router.put('/update', authMiddleware, updateAssistant);

export default router;
