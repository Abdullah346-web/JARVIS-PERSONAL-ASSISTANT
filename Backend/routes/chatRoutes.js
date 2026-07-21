import express from 'express';
import {
  createChat,
  getUserChats,
  getChat,
  addMessageToChat,
  deleteChat,
  clearChatHistory,
} from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createChat);
router.get('/all', authMiddleware, getUserChats);
router.get('/:chatId', authMiddleware, getChat);
router.post('/:chatId/message', authMiddleware, addMessageToChat);
router.delete('/:chatId', authMiddleware, deleteChat);
router.patch('/:chatId/clear', authMiddleware, clearChatHistory);

export default router;
