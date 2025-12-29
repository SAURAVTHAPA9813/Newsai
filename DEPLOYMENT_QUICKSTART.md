# 🚀 NewsAI - Deployment Quick Start

**Total Time:** 20-30 minutes | **Cost:** $0.00 (Completely Free)

---

## 📦 What You Need Before Starting

1. ✅ GitHub account
2. ✅ Your NewsAI code pushed to GitHub
3. ✅ MongoDB Atlas URI (you already have this)
4. ✅ API Keys ready:
   - Gemini API Key
   - NewsAPI.org Key
   - (Optional) Guardian, GNews, etc.

---

## 🎯 3-Step Deployment

### STEP 1️⃣: Deploy Backend (Render.com)

```bash
1. Go to: https://render.com
2. Sign up with GitHub
3. New + → Web Service → Connect "Newsai" repo
4. Configure:
   - Root Directory: server
   - Build: npm install
   - Start: npm start
   - Plan: FREE
5. Add Environment Variables (see below)
6. Deploy
7. COPY YOUR BACKEND URL: https://newsai-backend-xxxx.onrender.com
```

### STEP 2️⃣: Deploy Frontend (Vercel.com)

```bash
1. Go to: https://vercel.com
2. Sign up with GitHub
3. New Project → Import "Newsai" repo
4. Add Environment Variable:
   - VITE_API_URL = https://newsai-backend-xxxx.onrender.com
5. Deploy
6. COPY YOUR FRONTEND URL: https://newsai-xxxx.vercel.app
```

### STEP 3️⃣: Fix CORS

```bash
1. Go back to Render.com → Your service
2. Environment → Update FRONTEND_URL
   - Set to: https://newsai-xxxx.vercel.app
3. Save (auto-redeploys)
4. DONE! 🎉
```

---

## 🔑 Required Environment Variables

### Backend (Render.com):

Copy these into Render dashboard:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=random-64-char-string
GEMINI_API_KEY=your-gemini-key
NEWS_API_KEY=your-newsapi-key
FRONTEND_URL=https://newsai-xxxx.vercel.app
```

### Frontend (Vercel.com):

```bash
VITE_API_URL=https://newsai-backend-xxxx.onrender.com
```

---

## ✅ Verify Deployment

### Test Backend:
```bash
Visit: https://newsai-backend-xxxx.onrender.com
Should show: {"success": true, "message": "NewsAI API Server is running"}
```

### Test Frontend:
```bash
Visit: https://newsai-xxxx.vercel.app
Should show: NewsAI login/dashboard page
```

### Test Full App:
```bash
1. Open frontend URL
2. Try logging in
3. Load dashboard
4. No CORS errors in console ✅
```

---

## 🔄 Auto-Deploy Setup

**Already configured!** Just push code:

```bash
git add .
git commit -m "your changes"
git push origin main
```

→ Backend auto-deploys on Render ✅
→ Frontend auto-deploys on Vercel ✅

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS errors | Update `FRONTEND_URL` in Render to match Vercel URL |
| Blank frontend | Check `VITE_API_URL` in Vercel settings |
| 500 backend errors | Check Render logs for missing env vars |
| Slow first request | Render free tier sleeps (use UptimeRobot) |
| Articles not loading | Check news API keys and provider logs |

---

## 📚 Full Documentation

For detailed instructions, see: **`DEPLOYMENT_GUIDE.md`**

---

## 🆘 Emergency Checklist

If something breaks:

- [ ] Check Render logs
- [ ] Check Vercel deployment logs
- [ ] Check browser console (F12)
- [ ] Verify all environment variables are set
- [ ] Test backend URL directly
- [ ] Verify MongoDB Atlas connection
- [ ] Check CORS configuration

---

## 🎊 Your URLs

**Backend:** `https://_______________________.onrender.com`

**Frontend:** `https://_______________________.vercel.app`

**Database:** `MongoDB Atlas (already configured)`

---

**Done! Your app is live and auto-deploying! 🚀**
