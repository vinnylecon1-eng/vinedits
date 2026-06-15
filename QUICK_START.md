# 🚀 Vinedits - Quick Start Guide

Deploy your Advanced Viral Video Agent in 15 minutes with ONE command!

---

## ⚡ Super Quick Start (3 Steps)

### Step 1: Run Deployment Script
```bash
# On Mac/Linux
chmod +x deploy.sh
./deploy.sh

# On Windows
deploy.bat
```

### Step 2: Follow the Interactive Instructions
The script will show you exactly what to do on:
- GitHub
- Vercel
- Railway
- Supabase

### Step 3: Get Your Live Link
```
Frontend: https://vinedits.vercel.app
Backend: https://vinedits-production.up.railway.app
```

---

## 📋 What You Need (FREE Accounts)

1. **GitHub Account** - https://github.com (free)
2. **Vercel Account** - https://vercel.com (free)
3. **Railway Account** - https://railway.app (free $5 credit)
4. **Supabase Account** - https://supabase.com (free)

---

## 🎯 Deployment Steps (Detailed)

### 1. Create GitHub Repository

```bash
# Go to https://github.com/new
# Create repository named: vinedits
# Copy the HTTPS URL
```

### 2. Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/vinedits.git
git branch -M main
git push -u origin main
```

### 3. Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your "vinedits" repository
4. Configure:
   - Framework: **Vite**
   - Build Command: **npm run build**
   - Output Directory: **dist**
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-url.up.railway.app` (get this from Step 4)
6. Click "Deploy"
7. Wait 2-3 minutes
8. You'll get: **https://vinedits.vercel.app**

### 4. Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your "vinedits" repository
5. Configure:
   - Build Command: **npm run build:server**
   - Start Command: **npm start**
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-key-here-change-this
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. You'll get: **https://vinedits-production.up.railway.app**

### 5. Setup Database on Supabase

1. Go to https://supabase.com
2. Click "New Project"
3. Configure:
   - Project Name: **vinedits**
   - Database Password: (generate strong password)
   - Region: (select closest to you)
4. Click "Create new project"
5. Wait 2-3 minutes
6. Go to Settings > API
7. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
8. Go to SQL Editor
9. Run this SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Social accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Niche profiles table
CREATE TABLE niche_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  primary_theme VARCHAR(255),
  sub_themes JSONB,
  unique_angle TEXT,
  content_pillars JSONB,
  audience_demographics JSONB,
  engagement_patterns JSONB,
  optimal_posting_times JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated content table
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  content_type VARCHAR(50),
  platform VARCHAR(50),
  hooks JSONB,
  titles JSONB,
  descriptions JSONB,
  hashtags JSONB,
  captions JSONB,
  virality_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled posts table
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP NOT NULL,
  posted_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'scheduled',
  platform_post_id VARCHAR(255),
  engagement_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_niche_profiles_user_id ON niche_profiles(user_id);
CREATE INDEX idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
```

### 6. Update Vercel Environment Variable

1. Go back to Vercel
2. Go to Project Settings > Environment Variables
3. Update `VITE_API_URL` to your Railway URL
4. Redeploy (automatic)

---

## ✅ Verification

### Test Frontend
```
Visit: https://vinedits.vercel.app
You should see the login page
```

### Test Backend
```bash
curl https://vinedits-production.up.railway.app/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### Test Database
1. Go to Supabase dashboard
2. Go to Table Editor
3. Click "users" table
4. Should be empty (0 rows)

---

## 🎉 You're Live!

Your application is now live and ready to use!

### URLs:
- **Frontend:** https://vinedits.vercel.app
- **Backend API:** https://vinedits-production.up.railway.app
- **Database:** Supabase dashboard

### Features Available:
✅ User authentication (sign up/login)
✅ Niche analysis engine
✅ Content generation
✅ Scheduled posting
✅ Analytics dashboard
✅ Settings management

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | **$0** |
| Railway | $5 credit | **$0** |
| Supabase | 500MB storage | **$0** |
| **Total** | | **$0** |

**100% FREE - No credit card required!**

---

## 🆘 Troubleshooting

### Frontend won't load
- Check Vercel build logs
- Verify `VITE_API_URL` is correct
- Clear browser cache

### API requests fail
- Check Railway logs
- Verify backend is running
- Check CORS configuration in Express

### Database connection fails
- Verify Supabase credentials
- Check database tables exist
- Verify IP whitelist (if applicable)

### Sign up not working
- Check backend logs
- Verify database connection
- Check Supabase tables

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **Express Docs:** https://expressjs.com

---

## 🎯 Next Steps

1. ✅ Deploy your application
2. ✅ Test all features
3. ✅ Invite beta users
4. ✅ Collect feedback
5. ✅ Add API integrations (Instagram, TikTok, YouTube)
6. ✅ Scale to production

---

**Vinedits - Advanced Viral Video Agent**
**Deployed with ❤️ | June 2026**
