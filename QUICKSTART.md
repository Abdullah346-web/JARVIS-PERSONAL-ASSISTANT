# JARVIS AI - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn

### Step 1: Clone & Navigate
```bash
cd Jarvis
```

### Step 2: Start MongoDB
If using local MongoDB:
```bash
# macOS
brew services start mongodb-community

# Windows (if installed via msi)
# MongoDB will start automatically

# Or manually start mongod
mongod
```

### Step 3: Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create .env file (already included with example values)
# Verify or update .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/jarvis-ai
# JWT_SECRET=your_secret_key_here

# Start the server
npm run dev
```

Expected output:
```
🚀 JARVIS AI Backend is running on port 5000
📡 WebSocket server is ready for connections
MongoDB Connected: localhost
```

### Step 4: Frontend Setup (New Terminal/Tab)
```bash
cd Frontend

# Install dependencies
npm install

# .env file already exists with:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Expected output:
```
 VITE v8.0.10  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 5: Open in Browser
Navigate to: `http://localhost:5173`

## 📝 Usage Flow

### New User
1. Click "Sign Up"
2. Enter username, email, password
3. Click "Sign Up" button
4. Redirected to Login page
5. Login with credentials
6. Choose an AI Assistant
7. Give your assistant a custom name
8. Start chatting!

### Existing User
1. Click "Login"
2. Enter email and password
3. Choose to remember login if desired
4. Access your assistant and chats

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# macOS/Linux:
lsof -i :5000

# Windows:
netstat -ano | findstr :5000

# Kill the process or use a different port
# Update PORT in .env file
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
# Try connecting manually:
mongo

# Or for MongoDB 6.0+:
mongosh

# If not installed, install MongoDB Community:
# https://docs.mongodb.com/manual/installation/
```

### Frontend won't connect to backend
1. Verify backend is running on port 5000
2. Check .env file: `VITE_API_URL=http://localhost:5000/api`
3. Browser console should show API calls in Network tab

### Voice not working
1. Check browser permissions for microphone
2. Ensure HTTPS or localhost (required for Web Audio API)
3. Try Chrome or Edge (best support)

## 📦 Project Structure Summary

```
Jarvis/
├── Backend/        (Node.js + Express + MongoDB)
└── Frontend/       (React + Vite + Tailwind)
```

## 🎯 Features to Try

1. **Sign Up & Login** - Create account and authenticate
2. **Assistant Selection** - Choose from 10 AI assistants
3. **Chat Interface** - Type or use voice
4. **Voice Commands** - Try "Hello!", "Tell me a joke", etc.
5. **Settings** - Change theme, voice speed, assistant name
6. **Chat History** - All chats are saved and retrievable

## 🛑 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env file |
| MongoDB connection failed | Start MongoDB service |
| CORS errors | Check Frontend URL in Backend .env |
| Voice not working | Grant microphone permissions |
| Empty chats | Create new chat from sidebar |

## 📚 Useful Commands

```bash
# Backend
npm run dev      # Start development server
npm start        # Production server

# Frontend
npm run dev      # Start Vite server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌐 Accessing the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://localhost:27017/jarvis-ai

## ✨ Pro Tips

1. Use "Remember Me" on login to save credentials
2. Voice works best in a quiet environment
3. Customize your assistant name in Settings
4. Check browser console for API logs
5. Use Dev Tools Network tab to debug

## 🆘 Getting Help

If issues persist:
1. Check browser console (F12) for errors
2. Check terminal for backend errors
3. Verify MongoDB is running
4. Check all .env files are configured
5. Restart both frontend and backend

---

**Happy using JARVIS AI! 🚀**
