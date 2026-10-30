# JARVIS AI - Futuristic MERN AI Assistant

A premium full-stack AI assistant web application built with React.js, Node.js, Express, MongoDB, Tailwind CSS, and featuring voice recognition, real-time communication, and a stunning futuristic UI.

![JARVIS AI](https://img.shields.io/badge/JARVIS%20AI-v1.0.0-blue?style=flat-square)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🚀 Features

### Authentication System
- ✅ User Sign Up page with validation
- ✅ User Login page with "Remember Me" option
- ✅ JWT based authentication
- ✅ Password hashing using bcrypt
- ✅ Form validation
- ✅ Animated UI with glassmorphism

### Assistant Selection
- ✅ 10 premium AI assistant choices
- ✅ Unique avatars with glow effects
- ✅ 3D card animations
- ✅ Custom naming for each assistant
- ✅ Neon border effects
- ✅ Fully responsive grid layout

### AI Dashboard
- ✅ Sidebar navigation with chat history
- ✅ Animated AI orb/avatar
- ✅ Real-time clock display
- ✅ Greeting message on first load
- ✅ Voice control capabilities
- ✅ Modern chat interface
- ✅ Typing animations
- ✅ Floating UI elements
- ✅ Glass morphism design

### Voice Features
- ✅ Web Speech API integration
- ✅ Voice recognition (speech-to-text)
- ✅ Speech synthesis (text-to-speech)
- ✅ Voice wave animation
- ✅ Microphone permissions handling
- ✅ Continuous conversation mode

### Chat System
- ✅ User and AI message distinction
- ✅ Message timestamps
- ✅ Chat history persistence
- ✅ Real-time message updates
- ✅ Message typing animations
- ✅ Chat management (create, view, delete)

### Settings Page
- ✅ Change assistant name
- ✅ Dark/Light mode toggle
- ✅ Voice speed control
- ✅ Voice gender selection
- ✅ Notification toggle
- ✅ Logout functionality

### UI/UX Features
- ✅ Glassmorphism design
- ✅ Neon glow effects
- ✅ Smooth animations (Framer Motion)
- ✅ GSAP animations
- ✅ Floating particles
- ✅ Dark futuristic theme
- ✅ Responsive mobile & desktop design
- ✅ Polished transitions

## 🛠️ Tech Stack

### Frontend
- **React.js 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Zustand** - State management
- **Lucide Icons** - Icon library
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - WebSocket communication
- **CORS** - Cross-origin requests
- **Express Validator** - Input validation

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Jarvis
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and JWT Secret
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/jarvis-ai
# JWT_SECRET=your_long_secret_key
# NODE_ENV=development
# APP_TIME_ZONE=Asia/Karachi
# GEMINI_API_KEY=your_gemini_api_key
# GEMINI_MODEL=gemini-2.0-flash

# Start MongoDB (if using local)
# macOS: brew services start mongodb-community
# Windows: mongod

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Running the Application

1. **Start MongoDB**
   ```bash
   # If using MongoDB locally
   mongod
   ```

2. **Start Backend**
   ```bash
   cd Backend
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Folder Structure

```
Jarvis/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assistantController.js
│   │   ├── chatController.js
│   │   └── settingsController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Assistant.js
│   │   ├── Chat.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assistantRoutes.js
│   │   ├── chatRoutes.js
│   │   └── settingsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── db.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ChatInterface.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── DashboardComponents.jsx
    │   ├── pages/
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── AssistantSelection.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── context/
    │   │   └── store.js
    │   ├── hooks/
    │   │   ├── useVoice.js
    │   │   └── useStorage.js
    │   ├── animations/
    │   │   ├── variants.js
    │   │   └── gsapEffects.js
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── App.css
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── package.json
    ├── index.html
    └── .env
```

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jarvis-ai
JWT_SECRET=your_long_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
APP_TIME_ZONE=Asia/Karachi
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 AI Assistants

Choose from 10 premium AI assistants:

1. **JARVIS** - Iron Man's loyal AI (Gold glow)
2. **NOVA** - Bright cosmic assistant (Cyan glow)
3. **ECHO** - Responsive and adaptive (Pink glow)
4. **TITAN** - Powerful intelligence (Purple glow)
5. **AURA** - Mystical companion (Green glow)
6. **ZENITH** - Peak performance (Yellow glow)
7. **ALPHA** - First and finest (Magenta glow)
8. **ORION** - Navigation expert (Blue glow)
9. **VEGA** - Star-bright hub (Orange glow)
10. **NEXUS** - Network intelligence (Cyan glow)

## 🎯 User Flow

1. **Sign Up** → Create account with email & password
2. **Login** → Access with credentials
3. **Select Assistant** → Choose from 10 AI assistants
4. **Name Assistant** → Give custom name to your assistant
5. **Dashboard** → Interact with your AI via chat or voice
6. **Settings** → Customize experience

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Assistants
- `GET /api/assistants` - Get all assistants
- `POST /api/assistants/select` - Select and create user's assistant (Protected)
- `GET /api/assistants/my-assistant` - Get user's active assistant (Protected)
- `PUT /api/assistants/update` - Update assistant info (Protected)

### Chats
- `POST /api/chats/create` - Create new chat (Protected)
- `GET /api/chats/all` - Get all user chats (Protected)
- `GET /api/chats/:chatId` - Get specific chat (Protected)
- `POST /api/chats/:chatId/message` - Add message to chat (Protected)
- `DELETE /api/chats/:chatId` - Delete chat (Protected)
- `PATCH /api/chats/:chatId/clear` - Clear chat history (Protected)

### Settings
- `GET /api/settings` - Get user settings (Protected)
- `PUT /api/settings/update` - Update settings (Protected)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created by **Abdullah**

## 🙏 Acknowledgments

- Inspired by Iron Man's JARVIS AI
- UI Design inspired by cyberpunk and sci-fi interfaces
- Built with modern web technologies

## 📞 Support

For support, email or create an issue in the repository.

---

**Happy Coding! 🚀**

Built with ❤️ using MERN Stack
