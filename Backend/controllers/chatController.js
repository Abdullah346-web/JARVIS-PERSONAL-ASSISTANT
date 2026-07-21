import Chat from '../models/Chat.js';
import Assistant from '../models/Assistant.js';
import { ensureActiveAssistant } from './assistantController.js';

// Create new chat
export const createChat = async (req, res, next) => {
  try {
    const { title } = req.body;

    const assistant = await ensureActiveAssistant(req);

    const chat = await Chat.create({
      userId: req.userId,
      assistantId: assistant._id,
      title: title || 'New Chat',
      messages: [],
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat: {
        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all chats for user
export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt messages');

    res.status(200).json({
      success: true,
      chats: chats.map(chat => ({
        id: chat._id,
        title: chat.title,
        lastMessage: chat.messages[chat.messages.length - 1]?.content || 'No messages yet',
        createdAt: chat.createdAt,
        messageCount: chat.messages.length,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get single chat
export const getChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.userId,
    }).populate('assistantId', 'customName avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        assistant: {
          id: chat.assistantId._id,
          name: chat.assistantId.customName,
          avatar: chat.assistantId.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add message to chat
export const addMessageToChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, sender, isVoice } = req.body;

    if (!content || !sender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message content and sender',
      });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.userId },
      {
        $push: {
          messages: {
            sender,
            content,
            isVoice: isVoice || false,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      messages: chat.messages,
    });
  } catch (error) {
    next(error);
  }
};

// Delete chat
export const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      userId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Clear chat history
export const clearChatHistory = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.userId },
      { messages: [] },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat history cleared',
    });
  } catch (error) {
    next(error);
  }
};
