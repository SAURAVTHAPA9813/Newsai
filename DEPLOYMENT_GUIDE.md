# NewsAI - Complete Free Deployment Guide

This guide will help you deploy your NewsAI app **completely free** with automatic deployments from GitHub.

## 📋 What You'll Deploy

- **Frontend (React + Vite)** → Vercel (Free Forever)
- **Backend (Node.js + Express)** → Render.com (Free Tier)
- **Database (MongoDB)** → MongoDB Atlas (Already configured - Free 512MB)

## 🚀 Total Time: 20-30 minutes

---

## STEP 1: Prepare Your Repository

### 1.1 Push All Changes to GitHub

```bash
# Make sure you're in the project root
cd C:\Users\suraj\OneDrive\Desktop\Newsai

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: Add deployment configuration files"

# Push to GitHub
git push origin main
```

**✅ Configuration files created:**
- `server/render.yaml` - Backend deployment config
- `vercel.json` - Frontend deployment config
- `.env.production.example` - Frontend environment template

### 1.2 Verify Files on GitHub

Go to your GitHub repository and confirm these files are present:
- ✅ `server/render.yaml`
- ✅ `vercel.json`
- ✅ `package.json` (root)
- ✅ `server/package.json`

---

## STEP 2: Deploy Backend to Render.com

### 2.1 Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended for auto-deploy)
4. Authorize Render to access your GitHub repositories

### 2.2 Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select your **"Newsai"** repository
5. Click **"Connect"**

### 2.3 Configure Web Service

Fill in these settings **EXACTLY**:

| Setting | Value |
|---------|-------|
| **Name** | `newsai-backend` (or your preferred name) |
| **Region** | `Oregon (US West)` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **FREE** |

### 2.4 Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Click **"Add Environment Variable"** for each of these:

#### REQUIRED Variables (App won't start without these):

```bash
NODE_ENV=production
```

```bash
PORT=5000
```

```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/newsai
```
*Get this from your MongoDB Atlas dashboard → Connect → Connect your application*

```bash
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long-random-string
```
*Generate a random string: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")*

```bash
GEMINI_API_KEY=your-gemini-api-key
```
*Get from: https://makersuite.google.com/app/apikey*

```bash
NEWS_API_KEY=your-newsapi-org-key
```
*Get from: https://newsapi.org/register*

```bash
FRONTEND_URL=https://newsai.vercel.app
```
*⚠️ IMPORTANT: You'll update this AFTER deploying frontend (Step 3)*
*For now, use a placeholder like: https://newsai-temp.vercel.app*

#### OPTIONAL Variables (Recommended for better reliability):

```bash
GUARDIAN_API_KEY=your-guardian-key
```
*Get from: https://open-platform.theguardian.com/access/*

```bash
GNEWS_API_KEY=your-gnews-key
```
*Get from: https://gnews.io/*

```bash
NEWSDATA_API_KEY=your-newsdata-key
```
*Get from: https://newsdata.io/*

```bash
CURRENTS_API_KEY=your-currents-key
```
*Get from: https://currentsapi.services/en*

```bash
FINNHUB_API_KEY=your-finnhub-key
```
*Get from: https://finnhub.io/register*

### 2.5 Deploy Backend

1. Click **"Create Web Service"** (bottom)
2. Wait 3-5 minutes for deployment
3. Watch the logs for:
   - ✅ `MongoDB Connected Successfully`
   - ✅ `Server is running on port 5000`
   - ✅ `Provider System Status`

### 2.6 Get Your Backend URL

Once deployed, you'll see:
```
Your service is live at https://newsai-backend-xxxx.onrender.com
```

**📋 COPY THIS URL - You need it for Step 3!**

### 2.7 Test Backend

Click on your backend URL or visit:
```
https://newsai-backend-xxxx.onrender.com
```

You should see:
```json
{
  "success": true,
  "message": "NewsAI API Server is running"
}
```

✅ **Backend deployed successfully!**

---

## STEP 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Start Deploying"**
3. Sign up with **GitHub** (same account as Render)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **"Newsai"** repository
3. Click **"Import"**

### 3.3 Configure Project

Vercel will auto-detect your settings. Verify these:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (leave as root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.4 Add Environment Variable

1. Click **"Environment Variables"** section
2. Add this variable:

**Key:**
```
VITE_API_URL
```

**Value:** (Use YOUR backend URL from Step 2.6)
```
https://newsai-backend-xxxx.onrender.com
```

**⚠️ IMPORTANT:** No trailing slash!

3. Select **"Production"**, **"Preview"**, and **"Development"**

### 3.5 Deploy Frontend

1. Click **"Deploy"** (bottom)
2. Wait 2-3 minutes for deployment
3. Watch for success message

### 3.6 Get Your Frontend URL

You'll see:
```
🎉 Deployed to production
https://newsai-xxxxx.vercel.app
```

**📋 COPY THIS URL!**

### 3.7 Test Frontend

1. Visit your Vercel URL
2. You should see the NewsAI login/dashboard page
3. Test login functionality

---

## STEP 4: Update Backend CORS (CRITICAL!)

Your frontend can't communicate with backend yet. Fix this:

### 4.1 Update Backend Environment Variable

1. Go back to **Render.com**
2. Open your **newsai-backend** service
3. Click **"Environment"** (left sidebar)
4. Find **FRONTEND_URL**
5. Update the value to your **Vercel URL**:
   ```
   https://newsai-xxxxx.vercel.app
   ```
6. Click **"Save Changes"**
7. **Render will auto-redeploy** (wait 2-3 minutes)

### 4.2 Verify CORS Fix

1. Visit your frontend: `https://newsai-xxxxx.vercel.app`
2. Open browser DevTools (F12)
3. Try logging in or loading the dashboard
4. Check Console - **no CORS errors!** ✅

---

## STEP 5: Set Up Automatic Deployments

### 5.1 Backend Auto-Deploy (Render)

**Already configured!** Every time you push to `main`:

```bash
git add .
git commit -m "fix: update backend logic"
git push origin main
```

→ Render **automatically** rebuilds and deploys backend ✅

**Monitor deployments:**
- Go to Render dashboard
- Click on your service
- View **"Events"** tab

### 5.2 Frontend Auto-Deploy (Vercel)

**Already configured!** Every time you push to `main`:

```bash
git add .
git commit -m "feat: update UI"
git push origin main
```

→ Vercel **automatically** rebuilds and deploys frontend ✅

**Monitor deployments:**
- Go to Vercel dashboard
- Click on your project
- View **"Deployments"** tab

### 5.3 Preview Deployments (Bonus!)

**Vercel creates preview URLs for every branch:**

```bash
git checkout -b feature/new-ui
# Make changes
git add .
git commit -m "feat: new UI design"
git push origin feature/new-ui
```

→ Vercel creates: `https://newsai-xxxxx-git-feature-new-ui.vercel.app`

Test your changes before merging to `main`!

---

## 🎯 DEPLOYMENT COMPLETE!

Your app is now live at:

- **Frontend:** `https://newsai-xxxxx.vercel.app`
- **Backend:** `https://newsai-backend-xxxx.onrender.com`
- **Database:** MongoDB Atlas (already running)

---

## 📊 Monitoring & Maintenance

### Check Backend Logs (Render)

1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. See real-time server logs

### Check Frontend Logs (Vercel)

1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"** → Select deployment
4. Click **"View Function Logs"**

### Monitor Database (MongoDB Atlas)

1. Go to MongoDB Atlas
2. Click **"Clusters"**
3. View **"Metrics"** for storage/performance

---

## ⚠️ Important Free Tier Limitations

### Render.com Free Tier:

- **Sleeps after 15 minutes** of inactivity
- First request after sleep: **30-60 second delay** (cold start)
- **750 hours/month** free (enough for 1 service)

**Solution:** Use a free uptime monitor:
- **UptimeRobot** (https://uptimerobot.com)
- Ping your backend every 14 minutes
- Keeps it awake 24/7

### Vercel Free Tier:

- No sleep issues ✅
- 100 GB bandwidth/month
- Unlimited deployments

### MongoDB Atlas Free Tier:

- 512 MB storage
- Shared cluster (slower)
- No backups

---

## 🐛 Troubleshooting

### Frontend shows blank page

**Check:**
1. Browser console for errors (F12)
2. Verify `VITE_API_URL` is correct in Vercel
3. Test backend URL directly

**Fix:**
```bash
# Update environment variable in Vercel
Settings → Environment Variables → Edit VITE_API_URL
→ Redeploy
```

### CORS errors in browser console

**Error:**
```
Access to fetch at 'https://backend.onrender.com' blocked by CORS
```

**Fix:**
1. Go to Render → Environment
2. Update `FRONTEND_URL` to your Vercel URL
3. Wait for auto-redeploy

### Backend returns 500 errors

**Check Render logs:**
1. Render dashboard → Your service → Logs
2. Look for errors like:
   - `Missing required environment variables`
   - `MongoDB connection failed`

**Fix:**
- Add missing environment variables
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist (set to `0.0.0.0/0`)

### Articles not loading (timeout)

**Cause:** News API rate limits exceeded

**Fix:**
1. Add more news provider API keys (Guardian, GNews, etc.)
2. Check Render logs for provider status
3. Wait for rate limit reset (usually 24 hours)

### Backend slow on first request

**Cause:** Render free tier sleeps after 15 min

**Fix:**
- Use UptimeRobot to ping every 14 minutes
- Or upgrade to Render paid tier ($7/month)

---

## 🔄 How to Update Your App

### Update Code:

```bash
# Make changes locally
git add .
git commit -m "feat: your changes"
git push origin main
```

→ **Both frontend and backend auto-deploy** ✅

### Update Environment Variables:

**Backend (Render):**
1. Render dashboard → Your service
2. Environment tab
3. Edit variable
4. Save (auto-redeploys)

**Frontend (Vercel):**
1. Vercel dashboard → Your project
2. Settings → Environment Variables
3. Edit variable
4. Redeploy manually or push code change

---

## 📝 Custom Domain (Optional)

### Add Custom Domain to Vercel:

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel dashboard → Settings → Domains
3. Add your domain: `newsai.com`
4. Update DNS records (Vercel provides instructions)
5. SSL certificate auto-generated ✅

### Add Custom Domain to Render:

1. Render dashboard → Settings → Custom Domain
2. Add domain: `api.newsai.com`
3. Update DNS CNAME record
4. SSL certificate auto-generated ✅

**Update CORS:**
- Update `FRONTEND_URL` in Render to `https://newsai.com`

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render and returns JSON response
- [ ] Frontend deployed to Vercel and loads UI
- [ ] CORS configured (frontend can call backend)
- [ ] Environment variables set correctly
- [ ] MongoDB connected successfully
- [ ] Articles load on dashboard
- [ ] AI modules work
- [ ] User authentication works
- [ ] Auto-deployments configured (test with dummy commit)
- [ ] Logs accessible on both platforms

---

## 🆘 Need Help?

**Common Issues:**
- Check logs first (Render + Vercel + Browser console)
- Verify ALL environment variables are set
- Test backend URL directly in browser
- Check MongoDB Atlas connection

**Still stuck?**
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas docs: https://www.mongodb.com/docs/atlas/

---

## 📌 Quick Reference

### Backend URL Format:
```
https://YOUR-SERVICE-NAME.onrender.com
```

### Frontend URL Format:
```
https://YOUR-PROJECT-NAME.vercel.app
```

### MongoDB URI Format:
```
mongodb+srv://username:password@cluster.mongodb.net/newsai
```

### Git Push to Deploy:
```bash
git add .
git commit -m "your message"
git push origin main
```

---

**🚀 Your NewsAI app is now live and auto-deploying!**

Every git push to `main` automatically deploys to production.

Happy deploying! 🎊
