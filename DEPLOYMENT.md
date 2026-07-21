# JARVIS AI - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [MongoDB Setup](#mongodb-setup)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [API Testing](#api-testing)

---

## Local Development Setup

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB Community ([Download](https://www.mongodb.com/try/download/community))
- Git ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Jarvis
   ```

2. **Install Backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Verify MongoDB**
   ```bash
   # Test MongoDB connection
   mongosh
   # Type: exit
   ```

---

## Backend Deployment

### Local Backend Development

1. **Navigate to Backend**
   ```bash
   cd Backend
   ```

2. **Configure Environment**
   ```bash
   # .env file (already provided)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jarvis-ai
   JWT_SECRET=your_super_secret_key_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Deploy to Heroku

1. **Create Heroku account** at [heroku.com](https://www.heroku.com/)

2. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows (use installer)
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create Heroku App**
   ```bash
   cd Backend
   heroku create your-app-name
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=your_frontend_url
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. **Create Railway account** at [railway.app](https://railway.app/)

2. **Connect GitHub repository**

3. **Create new service**

4. **Set environment variables in Railway dashboard**

5. **Deploy from main branch**

---

## Frontend Deployment

### Local Frontend Development

1. **Navigate to Frontend**
   ```bash
   cd Frontend
   ```

2. **Configure Environment**
   ```bash
   # .env file (already provided)
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Deploy to Vercel

1. **Create Vercel account** at [vercel.com](https://vercel.com/)

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd Frontend
   vercel
   ```

4. **Update environment variable**
   - In Vercel Dashboard: Settings → Environment Variables
   - Add: `VITE_API_URL=your_backend_url/api`

### Deploy to Netlify

1. **Create Netlify account** at [netlify.com](https://www.netlify.com/)

2. **Build the project**
   ```bash
   cd Frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

4. **Update environment variable**
   - In Netlify: Site Settings → Build & Deploy → Environment
   - Add: `VITE_API_URL=your_backend_url/api`

### Deploy to GitHub Pages

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/Jarvis/',  // Change to your repo name
     // ... rest of config
   })
   ```

2. **Build**
   ```bash
   cd Frontend
   npm run build
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

---

## MongoDB Setup

### Local MongoDB

1. **Install MongoDB Community**
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/)
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows (if installed via MSI, it starts automatically)
   
   # Or manually start mongod
   mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh
   ```

### MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account** at [mongodb.com/cloud](https://www.mongodb.com/cloud)

2. **Create free tier cluster**
   - Click "Create" → Select free tier
   - Choose region closer to your backend
   - Create cluster

3. **Create database user**
   - Go to Database Access
   - Click "Add New Database User"
   - Set username and password
   - Save credentials

4. **Get connection string**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

5. **Update Backend .env**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster-url/jarvis-ai?retryWrites=true&w=majority
   ```

---

## Environment Variables

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/jarvis-ai
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster-url/jarvis-ai?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production_make_it_long_and_random
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
# For production:
# VITE_API_URL=https://your-backend-url/api
```

---

## Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Kill the process
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env file
```

**MongoDB connection failed**
```bash
# Make sure MongoDB is running
mongosh

# For MongoDB Atlas, verify:
# 1. Correct connection string
# 2. Whitelist your IP in MongoDB Atlas
# 3. Database user credentials are correct
```

**CORS error**
```bash
# Check Backend .env
# FRONTEND_URL must match frontend URL
# Verify CORS middleware in server.js
```

### Frontend Issues

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**API calls failing**
```bash
# Check .env file
VITE_API_URL=http://localhost:5000/api

# Verify backend is running
# Check browser console for errors
```

**Voice not working**
```bash
# Grant microphone permissions
# Use Chrome, Edge, or Safari (Firefox has limited support)
# Must be HTTPS in production or localhost in dev
```

---

## API Testing

### Using Postman

1. **Download Postman** from [postman.com](https://www.postman.com/)

2. **Create New Request**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/signup`
   - Body (JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```

3. **Test Other Endpoints**
   - Import collection from API routes

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","confirmPassword":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get Assistants
curl http://localhost:5000/api/assistants
```

---

## Production Checklist

- [ ] Update JWT_SECRET with strong, random key
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for production database
- [ ] Enable HTTPS for frontend
- [ ] Set FRONTEND_URL to production URL
- [ ] Update VITE_API_URL in frontend
- [ ] Test all features in production
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and alerts

---

## Performance Optimization

### Frontend
- [ ] Enable code splitting
- [ ] Minify and compress assets
- [ ] Lazy load components
- [ ] Optimize images
- [ ] Enable caching headers

### Backend
- [ ] Add caching strategies
- [ ] Optimize database queries
- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Set up rate limiting

---

## Monitoring & Logging

### Tools
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring
- **Datadog** - Infrastructure monitoring

### Setup
```bash
# Example: Sentry
npm install @sentry/react

# Initialize in your app
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "your_sentry_dsn",
});
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Support & Contact

For issues or questions:
1. Check this guide first
2. Check the repository issues
3. Create a new issue with details

Happy deploying! 🚀
