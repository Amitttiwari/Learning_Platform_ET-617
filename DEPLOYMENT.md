# 🚀 Deployment Guide: Vercel + Render

This guide will help you deploy the Learning Platform to Vercel (Frontend) and Render (Backend).

## 📋 Prerequisites

1. **GitHub Account** - To host your code
2. **Vercel Account** - For frontend deployment (vercel.com)
3. **Render Account** - For backend deployment (render.com)

## 🔧 Step 1: Prepare Your Code

### 1.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Create a new repository named `learning-website`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/learning-website.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account

### 2.2 Create Web Service
1. Click **"New Web Service"**
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: `learning-platform-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Environment Variables
Add these environment variables in Render:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secure-production-secret-key-here
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy your Render URL (e.g., `https://learning-platform-backend.onrender.com`)

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 3.2 Create Project
1. Click **"New Project"**
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Environment Variables
Add this environment variable in Vercel:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your Vercel URL (e.g., `https://learning-website.vercel.app`)

## 🔗 Step 4: Update URLs

### 4.1 Update Backend CORS
1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable with your Vercel URL
3. Redeploy the backend

### 4.2 Update Frontend API URL
1. Go back to Vercel dashboard
2. Update the `REACT_APP_API_URL` environment variable with your Render URL
3. Redeploy the frontend

## ✅ Step 5: Test Deployment

### 5.1 Test Registration
1. Go to your Vercel URL
2. Click "Register"
3. Create a new account
4. Verify registration works

### 5.2 Test Login
1. Use the sample account: `instructor` / `instructor123`
2. Verify login works

### 5.3 Test Course Content
1. Browse courses
2. Watch videos
3. Take quizzes
4. Check progress tracking

### 5.4 Test Analytics
1. Go to Analytics page
2. Check clickstream data
3. Test CSV export

## 🎉 Deployment Complete!

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`

### Features Working:
- ✅ User registration and login
- ✅ Course browsing and content
- ✅ Video streaming
- ✅ Interactive quizzes
- ✅ Progress tracking
- ✅ Analytics dashboard
- ✅ CSV export
- ✅ Clickstream tracking

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that `CLIENT_URL` in Render matches your Vercel URL exactly
   - Include `https://` in the URL

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` in Vercel points to your Render URL
   - Check that backend is running on Render

3. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **Database Issues**
   - SQLite files are created automatically
   - No additional setup needed

## 📊 Monitoring

### Render Dashboard:
- Monitor backend performance
- Check logs for errors
- View deployment status

### Vercel Dashboard:
- Monitor frontend performance
- Check build logs
- View analytics

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel
   - Update CORS settings in Render

2. **Database Migration** (Optional)
   - Consider PostgreSQL for production
   - Update database connection

3. **Security Enhancements**
   - Use stronger JWT secrets
   - Enable HTTPS
   - Add rate limiting

---

**Happy Learning! 📚** 