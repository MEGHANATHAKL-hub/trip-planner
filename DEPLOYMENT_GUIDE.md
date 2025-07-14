# 🚀 TripPlanner Deployment Guide

## Prerequisites
- GitHub account
- Render account (free)
- Netlify account (free)

## Step 1: Deploy Backend to Render

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 1.2 Create Render Web Service
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `trip-planner-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 1.3 Set Environment Variables
In Render dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://meghanathaklsanlak:yNfSTrQW5j55QTpz@cluster0.9wspd3a.mongodb.net/tripplanner?retryWrites=true&w=majority
JWT_SECRET=TripPlanner2024SecureJWTKey!@#$%^&*()_+RandomString789xyz
NODE_ENV=production
```

### 1.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Note your backend URL (e.g., `https://trip-planner-backend-xyz.onrender.com`)

## Step 2: Deploy Frontend to Netlify

### 2.1 Update Frontend Configuration
Update your frontend environment with the backend URL:

```bash
# In client/.env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 2.2 Rebuild Frontend
```bash
cd client
npm run build
```

### 2.3 Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `client/dist` folder
4. Or use Git integration:
   - Connect GitHub repository
   - Set build settings:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `client/dist`

### 2.4 Set Environment Variables
In Netlify dashboard, add:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## Step 3: Update CORS Settings

After getting your frontend URL, update the backend CORS settings:

1. Edit `server/server.js`
2. Replace the placeholder domains with your actual domains:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.netlify.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

3. Redeploy backend on Render

## Step 4: Test Your Deployed Application

1. Open your Netlify URL
2. Register a new account
3. Create a trip plan
4. Verify all functionality works

## 🎉 Your TripPlanner is now live!

**Frontend**: https://your-app-name.netlify.app
**Backend**: https://your-backend-name.onrender.com
**Database**: MongoDB Atlas

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS settings with correct frontend domain
2. **Build failures**: Check environment variables
3. **Database connection**: Verify MongoDB URI in production
4. **API calls failing**: Ensure VITE_API_URL is correct

### Logs:
- **Render**: Check deployment logs in Render dashboard
- **Netlify**: Check function logs in Netlify dashboard
- **MongoDB**: Check Atlas monitoring

## Free Tier Limitations

### Render:
- 750 hours/month
- Spins down after 15 minutes of inactivity
- Cold start delays

### Netlify:
- 300 build minutes/month
- 100GB bandwidth/month
- 2 concurrent builds

### MongoDB Atlas:
- 512MB storage
- Shared clusters
- Connection limits

## Scaling Up

When ready to scale:
1. **Backend**: Upgrade Render plan or move to Railway/Heroku
2. **Frontend**: Netlify Pro or Vercel Pro
3. **Database**: MongoDB Atlas paid tiers
4. **CDN**: Add Cloudflare for better performance