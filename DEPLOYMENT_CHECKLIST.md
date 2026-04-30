# Complete Deployment Checklist

## Phase 1: Pre-Deployment ✅ (Already Done)

- [x] Full-stack application built
- [x] Code pushed to GitHub: https://github.com/adiii0001/Task-Manager
- [x] MongoDB Atlas cluster created
- [x] MongoDB connection string obtained
- [x] Backend environment variables configured in Railway

---

## Phase 2: Backend Deployment (IN PROGRESS)

### Backend Service Status
- [ ] Backend service created in Railway
- [ ] Backend service shows "Running" status
- [ ] Backend URL copied (e.g., `https://task-manager-backend-prod.up.railway.app`)

### Backend Environment Variables (Verify in Railway)
- [ ] `PORT=3000`
- [ ] `MONGO_URI=mongodb+srv://Adityadev:MyPassword123@cluster0.czdmqhm.mongodb.net/taskmanager?retryWrites=true&w=majority`
- [ ] `JWT_SECRET=TaskFlow@SecretKey2024`
- [ ] `NODE_ENV=production`
- [ ] `CLIENT_URL=` (will update in Phase 3)

### Backend Root Directory
- [ ] Root Directory set to `backend` in Railway Settings

---

## Phase 3: Frontend Deployment (TODO)

### Frontend Service Setup
- [ ] Frontend service created in Railway
- [ ] Root Directory set to `frontend` in Railway Settings
- [ ] Build Command set to `npm run build`
- [ ] Start Command set to `npm run preview`

### Frontend Environment Variables
- [ ] `VITE_API_URL=https://your-backend-railway-url/api`
  - Replace with actual backend URL from Phase 2

### Frontend Deployment
- [ ] Frontend service shows "Running" status
- [ ] Frontend URL copied (e.g., `https://task-manager-frontend-prod.up.railway.app`)

---

## Phase 4: Post-Deployment Configuration (TODO)

### Update Backend with Frontend URL
- [ ] Backend `CLIENT_URL` updated with frontend URL
- [ ] Backend service redeployed automatically

### Update Frontend with Backend URL
- [ ] Frontend `VITE_API_URL` updated with backend URL
- [ ] Frontend service redeployed automatically

---

## Phase 5: Testing (TODO)

### Functionality Tests
- [ ] Frontend loads without errors
- [ ] Can navigate to signup page
- [ ] Can create new account (first user becomes admin)
- [ ] Can login with created account
- [ ] Can see dashboard with statistics
- [ ] Can create a new project
- [ ] Can create a task in project
- [ ] Can update task status
- [ ] Can view all tasks
- [ ] Can logout

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] API responses are fast
- [ ] No console errors in browser (F12)

### Database Tests
- [ ] Data persists after page refresh
- [ ] Multiple users can login simultaneously
- [ ] Tasks appear for correct users

---

## Phase 6: Monitoring (TODO)

### Railway Dashboard
- [ ] Backend service metrics checked
- [ ] Frontend service metrics checked
- [ ] No error logs in past 24 hours
- [ ] CPU usage is normal (< 50%)
- [ ] Memory usage is normal (< 200MB)

### Application Monitoring
- [ ] Set up error tracking (optional)
- [ ] Monitor user signups
- [ ] Monitor API response times

---

## Phase 7: Documentation (TODO)

### Update Documentation
- [ ] README.md updated with deployed URLs
- [ ] Deployment guide completed
- [ ] Team notified of live application
- [ ] Share frontend URL with team

---

## Quick Command Reference

### Local Testing (Before Deployment)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Git Push (After Changes)
```bash
git add .
git commit -m "Your message"
git push
```

### MongoDB Connection String
```
mongodb+srv://Adityadev:MyPassword123@cluster0.czdmqhm.mongodb.net/taskmanager?retryWrites=true&w=majority
```

---

## Important URLs

### GitHub Repository
- https://github.com/adiii0001/Task-Manager

### MongoDB Atlas
- https://cloud.mongodb.com
- Cluster: Cluster0
- Database: taskmanager
- User: Adityadev

### Railway
- https://railway.app
- Project: Task-Manager

---

## Environment Variables Summary

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb+srv://Adityadev:MyPassword123@cluster0.czdmqhm.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=TaskFlow@SecretKey2024
NODE_ENV=production
CLIENT_URL=https://your-frontend-railway-url
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-railway-url/api
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MONGO_URI, ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0 |
| Frontend can't connect to API | Verify VITE_API_URL is correct and backend is running |
| Signup fails | Check backend logs, verify MongoDB connection |
| Build fails | Check Railway logs, ensure package.json has correct scripts |
| CORS errors | Backend CORS already configured, check browser console for details |

---

## Success Indicators ✅

When deployment is complete, you should see:

1. ✅ Frontend URL accessible in browser
2. ✅ Login page loads without errors
3. ✅ Can create account and login
4. ✅ Dashboard shows user statistics
5. ✅ Can create projects and tasks
6. ✅ Data persists across page refreshes
7. ✅ No errors in browser console (F12)
8. ✅ Backend logs show successful requests

---

## Next Steps After Deployment

1. **Share with Team**: Send frontend URL to team members
2. **Monitor**: Check Railway logs regularly for errors
3. **Update**: Push changes to GitHub, Railway auto-deploys
4. **Scale**: Upgrade MongoDB Atlas plan if needed
5. **Custom Domain**: Add custom domain in Railway Settings (optional)

---

## Support Resources

- **Railway Documentation**: https://docs.railway.app
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com
- **Express.js Documentation**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Tailwind CSS Documentation**: https://tailwindcss.com

---

**Last Updated**: April 30, 2026  
**Status**: Ready for Phase 3 (Frontend Deployment)

