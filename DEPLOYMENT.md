# NewsAI - Production Deployment Guide

## 🚀 Beta Deployment Checklist (Next Week Launch)

This guide will help you deploy NewsAI for **100 beta users** using **free tier services**.

---

## 📋 Pre-Deployment Checklist

### ✅ Critical Security Fixes (COMPLETED)
- [x] httpOnly cookie authentication implemented
- [x] CORS configured for production
- [x] Rate limiting enabled
- [x] Security headers (helmet) configured
- [x] Input sanitization (XSS, NoSQL injection)
- [x] Environment variable validation
- [x] Auth middleware enhanced with cookie support
- [x] Logout route added

### 🔄 Next Steps (DO BEFORE DEPLOYMENT)

#### 1. Set Up Production MongoDB (15 minutes)
- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Create account (free)
- [ ] Create M0 free cluster (512MB, shared CPU)
- [ ] Set cluster name: `newsai-production`
- [ ] Choose region closest to your users
- [ ] Create database user:
  - Username: `newsai-admin`
  - Password: Generate strong password (save securely!)
- [ ] Network Access:
  - Click "Add IP Address"
  - Select "Allow Access from Anywhere" (0.0.0.0/0)
  - Note: For production, restrict to Render IPs later
- [ ] Get connection string:
  - Click "Connect" > "Connect your application"
  - Copy connection string
  - Replace `<password>` with your database password
  - Replace `<dbname>` with `newsai`
- [ ] Save connection string for Render deployment

**Example connection string:**
```
mongodb+srv://newsai-admin:YOUR_PASSWORD@newsai-production.xxxxx.mongodb.net/newsai?retryWrites=true&w=majority
```

#### 2. Generate Strong JWT Secret (2 minutes)
```bash
cd server
node generate-jwt-secret.js
```
- [ ] Copy the generated secret
- [ ] Save it securely (you'll need it for Render)
- [ ] NEVER commit this to Git!

#### 3. Get Additional Free API Keys (30 minutes)
You already have some API keys. Get backups for reliability:

**Required (you have):**
- [x] Google Gemini API
- [x] At least one news provider

**Recommended additional keys (free):**
- [ ] Guardian API: https://open-platform.theguardian.com/access/
  - 500 requests/day
  - Excellent for backup
- [ ] NewsData.io: https://newsdata.io/register
  - 200 requests/day
  - Good coverage
- [ ] Currents API: https://currentsapi.services/en/register
  - 600 requests/day
  - Great fallback

**Optional (for error tracking):**
- [ ] Sentry: https://sentry.io/signup/
  - 5,000 events/month free
  - Highly recommended for beta

---

## 🖥️ Backend Deployment (Render.com)

### Step 1: Prepare Repository
```bash
# Ensure your code is committed
git add .
git commit -m "feat: production-ready deployment with security fixes"
git push origin main
```

### Step 2: Deploy to Render (10 minutes)

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" > "Web Service"
   - Connect your GitHub account
   - Select `Newsai` repository
   - Click "Connect"

3. **Configure Service**
   - **Name:** `newsai-backend` (or your preferred name)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     cd server && npm install
     ```
   - **Start Command:**
     ```bash
     cd server && npm start
     ```
   - **Instance Type:** `Free`

4. **Add Environment Variables**
   Click "Advanced" > "Add Environment Variable" and add:

   ```bash
   NODE_ENV=production
   PORT=5000

   # MongoDB (from Step 1)
   MONGODB_URI=mongodb+srv://newsai-admin:PASSWORD@cluster.mongodb.net/newsai

   # JWT Secret (from Step 2)
   JWT_SECRET=your-generated-64-char-secret

   # Will update after Vercel deployment
   FRONTEND_URL=http://localhost:5173

   # Your existing API keys
   GEMINI_API_KEY=your-key
   NEWS_API_KEY=your-key
   GUARDIAN_API_KEY=your-key
   NEWSDATA_API_KEY=your-key
   CURRENTS_API_KEY=your-key
   GNEWS_API_KEY=your-key

   # Optional: Sentry
   SENTRY_DSN=your-sentry-dsn
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Note your backend URL: `https://newsai-backend-xyz.onrender.com`

6. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/`
   - Should see: `{"success":true,"message":"NewsAI API Server is running"}`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment
Update `.env.production` with your Render backend URL:
```bash
VITE_API_URL=https://newsai-backend-xyz.onrender.com
VITE_APP_ENV=production
```

### Step 2: Deploy to Vercel (5 minutes)

1. **Create Vercel Account**
   - Go to https://vercel.com/
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." > "Project"
   - Import your `Newsai` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables**
   Under "Environment Variables" section, add:
   ```bash
   VITE_API_URL=https://newsai-backend-xyz.onrender.com
   VITE_APP_ENV=production
   ```
   - Apply to: Production

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Note your frontend URL: `https://newsai-xyz.vercel.app`

6. **Test Frontend**
   - Visit your Vercel URL
   - Should load the app
   - Try logging in

---

## 🔗 Connect Frontend & Backend

### Update Backend CORS

1. Go to Render dashboard
2. Click on your web service
3. Go to "Environment"
4. Update `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://newsai-xyz.vercel.app
   ```
5. Click "Save Changes"
6. Service will auto-redeploy (2-3 minutes)

### Test Connection

Visit your Vercel app and test:
- [ ] App loads without CORS errors
- [ ] Can view news articles
- [ ] Can register new account
- [ ] Can login
- [ ] Can use AI features
- [ ] Cookies are set (check DevTools > Application > Cookies)

---

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to start"**
- Check Render logs: Dashboard > Logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**"MongoNetworkError"**
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify connection string password is URL-encoded

**"Missing environment variable"**
- Check Render environment variables
- Required: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, NEWS_API_KEY

### Frontend Issues

**"Network Error" or CORS errors**
- Verify VITE_API_URL matches Render URL exactly
- Check backend FRONTEND_URL matches Vercel URL
- Ensure backend has redeployed after CORS change

**API calls fail**
- Check browser DevTools > Network tab
- Verify cookies are being sent (Credentials: include)
- Check if backend is awake (free tier sleeps after 15min)

**Cold Start (slow first load)**
- Normal for Render free tier
- First request wakes up server (~30 seconds)
- Subsequent requests are fast

---

## 📊 Post-Deployment Monitoring

### Daily Checks (Beta Week 1)

**API Usage** (Check daily to avoid hitting limits)
- [ ] NewsAPI.org: https://newsapi.org/account
- [ ] Guardian: Your API dashboard
- [ ] NewsData.io: Your API dashboard
- [ ] Gemini: https://aistudio.google.com/app/apikey

**Database Storage**
- [ ] MongoDB Atlas: Check "Metrics" tab
- [ ] Current usage should be < 100MB for beta
- [ ] Alert if approaching 400MB (80% of 512MB)

**Error Tracking** (if using Sentry)
- [ ] Check for new errors
- [ ] Address critical errors immediately
- [ ] Monitor error rate trends

**Server Health**
- [ ] Render: Check "Metrics" and "Logs"
- [ ] Watch for crashes or restarts
- [ ] Monitor response times

### User Feedback
- [ ] Create feedback form/email
- [ ] Monitor cold start complaints
- [ ] Track feature requests
- [ ] Log bugs reported by users

---

## ⚠️ Known Beta Limitations

**Communicate these to beta users:**

1. **Cold Starts (Render Free Tier)**
   - Server sleeps after 15 minutes of inactivity
   - First request may take 30 seconds to wake up
   - Subsequent requests are fast

2. **News Update Frequency**
   - Updates cached for 15-20 minutes
   - Due to free tier API limits
   - Sufficient for news consumption

3. **Database Storage**
   - 512MB limit (about 10,000 articles)
   - Automatic cleanup of old articles implemented

4. **Concurrent Users**
   - Optimized for 100 users max
   - May experience slowdowns if exceeded

5. **AI Features**
   - 60 requests/minute limit (Gemini free tier)
   - Should be fine for 100 users

---

## 🎯 Success Metrics for Beta

Track these during beta week:

- [ ] Number of signups
- [ ] Daily active users
- [ ] Average session duration
- [ ] AI module usage
- [ ] Error rate < 1%
- [ ] API limits not exceeded
- [ ] No critical bugs

---

## 🔄 Updating After Deployment

### Backend Updates
```bash
# Make changes locally
git add .
git commit -m "fix: description"
git push origin main

# Render auto-deploys from GitHub
# Check deployment status in Render dashboard
```

### Frontend Updates
```bash
# Make changes locally
git add .
git commit -m "feat: description"
git push origin main

# Vercel auto-deploys from GitHub
# Check deployment status in Vercel dashboard
```

---

## 🚨 Emergency Procedures

### If Backend Goes Down
1. Check Render dashboard for errors
2. Check MongoDB Atlas status
3. Review recent changes in Git
4. Rollback if needed: Render > Deploys > Redeploy previous version

### If Frontend Goes Down
1. Check Vercel dashboard
2. Review build logs
3. Rollback: Vercel > Deployments > Promote previous deployment

### If API Limits Exceeded
1. Check which provider hit limit
2. Switch to backup provider (automatic failover)
3. Consider upgrading to paid tier if critical
4. Increase caching duration temporarily

---

## 📞 Support Resources

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com/

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**MongoDB Atlas:**
- Docs: https://www.mongodb.com/docs/atlas/
- Support: https://www.mongodb.com/cloud/atlas/support

---

## ✅ Final Checklist

Before announcing beta:
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] All critical features tested
- [ ] Error tracking set up
- [ ] Monitoring plan in place
- [ ] User feedback mechanism ready
- [ ] Known limitations documented
- [ ] Emergency procedures reviewed
- [ ] Backup API keys configured

---

**Estimated Total Deployment Time:** 1-2 hours
**Cost:** $0 (all free tiers)
**Supports:** Up to 100 concurrent users

Good luck with your beta launch! 🚀
