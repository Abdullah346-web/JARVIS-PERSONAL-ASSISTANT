import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assistants', assistantRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user_typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  socket.on('assistant_typing', (data) => {
    io.emit('assistant_typing', data);
  });

  socket.on('message_sent', (data) => {
    io.emit('message_sent', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`🚀 JARVIS AI Backend is running on port ${PORT}`);
    console.log(`📡 WebSocket server is ready for connections`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

export default app;
