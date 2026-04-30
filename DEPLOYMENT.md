# Deployment Guide - Railway

This guide will help you deploy the Team Task Manager to Railway.

## Prerequisites
- GitHub account with the repository pushed
- Railway account (https://railway.app)
- MongoDB Atlas account (for cloud database)

---

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Create a new cluster (M0 free tier)
4. Create a database user with username and password
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend on Railway

### 2.1 Create Backend Service
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the `Task-Manager` repository
6. Railway will auto-detect it's a Node.js project

### 2.2 Configure Backend Environment Variables
In Railway dashboard, go to your backend service and add these variables:

```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
CLIENT_URL=https://your-frontend-railway-url
```

### 2.3 Set Root Directory (Important!)
1. In Railway, go to Settings
2. Set "Root Directory" to `backend`
3. Save

### 2.4 Deploy
- Railway will automatically deploy when you push to GitHub
- Wait for the build to complete
- Copy your backend URL (e.g., `https://task-manager-backend-prod.up.railway.app`)

---

## Step 3: Deploy Frontend on Railway

### 3.1 Create Frontend Service
1. In the same Railway project, click "New"
2. Select "GitHub Repo"
3. Select the same `Task-Manager` repository
4. Railway will detect it's a Node.js project

### 3.2 Configure Frontend Environment Variables
Add this variable:

```
VITE_API_URL=https://your-backend-railway-url/api
```

Replace `your-backend-railway-url` with the actual URL from Step 2.4

### 3.3 Set Root Directory
1. Go to Settings
2. Set "Root Directory" to `frontend`
3. Save

### 3.4 Configure Build & Start Commands
In Railway Settings:

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm run preview
```

Or use a simple HTTP server:
```
npx serve -s dist -l 3000
```

### 3.5 Deploy
- Railway will build and deploy automatically
- Wait for completion
- Your frontend URL will be displayed (e.g., `https://task-manager-frontend-prod.up.railway.app`)

---

## Step 4: Update Frontend API URL

Once you have both URLs:

1. Go to your GitHub repository
2. Edit `frontend/.env.production`
3. Update with your backend URL:
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```
4. Commit and push
5. Railway will automatically redeploy

---

## Step 5: Verify Deployment

1. Open your frontend URL in browser
2. Try to sign up with a new account
3. Create a project
4. Create a task
5. Verify everything works

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check `MONGO_URI` in Railway environment variables
- Ensure MongoDB Atlas IP whitelist includes Railway IPs (or allow all: 0.0.0.0/0)
- Test connection string locally first

### Frontend showing "Signup failed"
- Check browser console (F12)
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible

### Build fails
- Check Railway logs for errors
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility

### CORS errors
- Backend CORS is already configured for production
- If issues persist, check `backend/server.js` CORS settings

---

## Environment Variables Reference

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskmanager
JWT_SECRET=your-secret-key
NODE_ENV=production
CLIENT_URL=https://your-frontend-url
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url/api
```

---

## Monitoring & Logs

1. Go to Railway dashboard
2. Click on your service
3. View "Logs" tab for real-time logs
4. Check "Metrics" for performance

---

## Updating Your Application

After deployment, to update:

1. Make changes locally
2. Commit and push to GitHub
3. Railway automatically redeploys
4. Check logs to verify deployment

---

## Custom Domain (Optional)

1. In Railway, go to your service
2. Click "Settings"
3. Add custom domain
4. Update DNS records with your domain provider

---

## Cost

- **Free tier includes:**
  - 500 hours/month of compute
  - 5GB bandwidth
  - Enough for small projects

- **MongoDB Atlas:**
  - Free tier: 512MB storage
  - Upgrade as needed

---

## Support

- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- GitHub Issues: Report bugs in your repository

---

**Your app is now live! 🚀**
