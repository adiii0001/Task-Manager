# Railway Deployment - Step-by-Step Checklist

## Current Status
✅ Full-stack application built and tested locally  
✅ Code pushed to GitHub: https://github.com/adiii0001/Task-Manager  
✅ MongoDB Atlas cluster ready with connection string  
✅ Backend environment variables configured in Railway  
⏳ **NEXT**: Complete backend and frontend deployment

---

## STEP 1: Verify Backend Service is Running on Railway

### What to do:
1. Go to https://railway.app
2. Open your Task-Manager project
3. Click on the **backend** service
4. Check the status:
   - Should show "Running" (green)
   - If "Building" - wait for it to complete
   - If "Failed" - check the Logs tab for errors

### If Backend is Running:
- Copy the **Railway URL** for backend (looks like: `https://task-manager-backend-prod.up.railway.app`)
- You'll need this URL for the frontend

### If Backend Failed:
- Click "Logs" tab
- Look for error messages
- Common issues:
  - MongoDB connection failed → Check MONGO_URI is correct
  - Port already in use → Should be 3000
  - Missing environment variables → Add them in Variables tab

---

## STEP 2: Deploy Frontend Service

### 2.1 Create Frontend Service in Railway
1. Go to your Railway project dashboard
2. Click **"New"** button (top right)
3. Select **"GitHub Repo"**
4. Select the same **Task-Manager** repository
5. Railway will auto-detect it's a Node.js project

### 2.2 Configure Frontend Environment Variables
1. Click on the **frontend** service
2. Go to **Variables** tab
3. Add this variable:
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```
   Replace `your-backend-railway-url` with the actual URL from Step 1

### 2.3 Set Root Directory
1. Click **Settings** tab
2. Find "Root Directory" field
3. Enter: `frontend`
4. Click Save

### 2.4 Configure Build & Start Commands
1. Still in Settings tab
2. Find "Build Command" field
3. Enter: `npm run build`
4. Find "Start Command" field
5. Enter: `npm run preview`
6. Click Save

### 2.5 Deploy
- Railway will automatically start building
- Wait for the build to complete (usually 2-5 minutes)
- Once complete, you'll see a green "Running" status
- Copy the **Frontend URL** (looks like: `https://task-manager-frontend-prod.up.railway.app`)

---

## STEP 3: Update Backend with Frontend URL

### 3.1 Update Backend Environment Variable
1. Go back to your Railway project
2. Click on the **backend** service
3. Go to **Variables** tab
4. Find `CLIENT_URL` variable
5. Update it with your frontend URL:
   ```
   CLIENT_URL=https://your-frontend-railway-url
   ```
6. Click Save

### 3.2 Backend Will Auto-Redeploy
- Railway will automatically redeploy the backend with the new variable
- Wait for it to show "Running" again

---

## STEP 4: Test Your Deployed Application

### 4.1 Open Frontend in Browser
1. Go to your frontend URL (from Step 2.5)
2. You should see the login page

### 4.2 Test Signup
1. Click "Sign Up"
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Sign Up"
4. Should redirect to Dashboard

### 4.3 Test Creating a Project
1. On Dashboard, click "Create Project"
2. Enter:
   - Project Name: Test Project
   - Description: Testing deployment
3. Click "Create"
4. Should see the project in the list

### 4.4 Test Creating a Task
1. Click on the project
2. Click "Create Task"
3. Enter task details
4. Click "Create"
5. Should see the task appear

### 4.5 If Tests Pass ✅
- Your application is successfully deployed!
- Share the frontend URL with your team

### 4.6 If Tests Fail ❌
- Check browser console (F12) for errors
- Check Railway logs for backend errors
- Common issues:
  - **"Cannot connect to API"** → Check VITE_API_URL is correct
  - **"Signup failed"** → Check backend logs for MongoDB connection issues
  - **"Page not loading"** → Check frontend build completed successfully

---

## STEP 5: Monitor Your Application

### View Logs
1. Go to Railway dashboard
2. Click on backend or frontend service
3. Click **Logs** tab
4. See real-time logs as users interact with app

### View Metrics
1. Click **Metrics** tab
2. See CPU, memory, and bandwidth usage
3. Monitor for any issues

---

## STEP 6: Update Your Application (After Deployment)

Whenever you make changes:

1. Make changes locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
4. Railway automatically detects the push
5. Railway automatically rebuilds and redeploys
6. Check logs to verify deployment

---

## Quick Reference: Your URLs

Once deployed, you'll have:

```
Frontend URL: https://your-frontend-railway-url
Backend URL: https://your-backend-railway-url
Backend API: https://your-backend-railway-url/api
```

---

## Troubleshooting Guide

### Issue: Backend shows "Failed" status
**Solution:**
1. Click Logs tab
2. Look for error messages
3. Check MONGO_URI is correct
4. Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Issue: Frontend shows "Cannot connect to API"
**Solution:**
1. Check VITE_API_URL in frontend Variables
2. Ensure it matches your backend URL exactly
3. Redeploy frontend after updating

### Issue: Signup fails with "Network error"
**Solution:**
1. Check backend is running (green status)
2. Check backend logs for errors
3. Verify MONGO_URI connection string is correct

### Issue: Build fails on Railway
**Solution:**
1. Check build logs for specific error
2. Ensure package.json has correct scripts
3. Try building locally first: `npm run build`

### Issue: MongoDB connection timeout
**Solution:**
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Add IP: 0.0.0.0/0 (allow all)
4. Wait a few minutes for changes to take effect

---

## Success Checklist ✅

- [ ] Backend service is running on Railway
- [ ] Frontend service is running on Railway
- [ ] Frontend can connect to backend API
- [ ] Can sign up new user
- [ ] Can create project
- [ ] Can create task
- [ ] Can update task status
- [ ] Can see dashboard with statistics

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Check Logs**: Always check Railway logs first for error details

---

**You're almost there! 🚀 Follow these steps and your app will be live!**
