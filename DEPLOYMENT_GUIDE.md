# Deployment Guide - Advanced Viral Video Agent

Deploy your Viral Video Agent to free hosting using Vercel, Railway, and Supabase.

---

## 🚀 Quick Deployment (5 minutes)

### Step 1: Create Accounts (Free)

1. **Vercel** - https://vercel.com (Frontend hosting)
2. **Railway** - https://railway.app (Backend hosting)
3. **Supabase** - https://supabase.com (Database)
4. **Upstash** - https://upstash.com (Redis cache)

### Step 2: Deploy Frontend to Vercel

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/advanced-viral-agent.git
git push -u origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Select your GitHub repository
# 5. Configure:
#    - Framework: Vite
#    - Root Directory: ./
#    - Build Command: npm run build
#    - Output Directory: dist
# 6. Add environment variables:
#    - VITE_API_URL=https://your-railway-app.up.railway.app

# 7. Click "Deploy"
```

### Step 3: Deploy Backend to Railway

```bash
# 1. Go to railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Choose your repository
# 5. Configure:
#    - Root Directory: ./
#    - Build Command: npm run build:server
#    - Start Command: npm start
# 6. Add environment variables:
#    - NODE_ENV=production
#    - JWT_SECRET=your_secret_key
#    - SUPABASE_URL=your_supabase_url
#    - SUPABASE_KEY=your_supabase_key
#    - OPENAI_API_KEY=your_openai_key
# 7. Click "Deploy"
```

### Step 4: Setup Database (Supabase)

```bash
# 1. Go to supabase.com
# 2. Click "New Project"
# 3. Configure:
#    - Project Name: viral-agent
#    - Database Password: (generate strong password)
#    - Region: Select closest to you
# 4. Wait for project creation
# 5. Go to Settings > API
# 6. Copy:
#    - Project URL → SUPABASE_URL
#    - anon public key → SUPABASE_KEY
#    - service_role key → SUPABASE_SERVICE_ROLE_KEY
# 7. Run migrations (see Database Setup below)
```

### Step 5: Setup Redis Cache (Upstash)

```bash
# 1. Go to upstash.com
# 2. Click "Create Database"
# 3. Configure:
#    - Name: viral-agent-cache
#    - Region: Select closest to you
#    - Type: Redis
# 4. Copy connection string → REDIS_URL
```

---

## 🗄️ Database Setup

### Create Tables in Supabase

Go to Supabase SQL Editor and run:

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

---

## 🔑 Environment Variables

Create `.env.production` with:

```env
# Application
NODE_ENV=production
PORT=5000

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Social Media APIs
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret

TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret

YOUTUBE_API_KEY=your_youtube_key

FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret

# Redis
REDIS_URL=redis://default:password@host:port

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Frontend URL
VITE_API_URL=https://your-api-domain.com
```

---

## 📱 Social Media API Setup

### Instagram Graph API

1. Go to https://developers.facebook.com
2. Create app → Business
3. Add Instagram Graph API product
4. Get credentials:
   - App ID
   - App Secret
   - Access Token (user token)

### TikTok Business API

1. Go to https://developers.tiktok.com
2. Create app → Business
3. Get credentials:
   - Client Key
   - Client Secret

### YouTube Data API

1. Go to https://console.cloud.google.com
2. Create project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Copy API Key

### Facebook Graph API

1. Go to https://developers.facebook.com
2. Create app → Business
3. Add Facebook Login product
4. Get credentials:
   - App ID
   - App Secret

---

## 🚀 Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel account created and frontend deployed
- [ ] Railway account created and backend deployed
- [ ] Supabase account created and database configured
- [ ] Upstash account created and Redis configured
- [ ] All environment variables set in each platform
- [ ] Database tables created and indexed
- [ ] Social media API credentials obtained
- [ ] Frontend can communicate with backend API
- [ ] Backend can connect to database
- [ ] SSL certificates auto-generated (Vercel/Railway)
- [ ] Domain configured (optional)

---

## 🔍 Verification

### Test Frontend
```bash
# Visit your Vercel URL
https://your-app.vercel.app

# Should see login page
```

### Test Backend
```bash
# Check health endpoint
curl https://your-api.railway.app/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Test Database
```bash
# In Supabase, run:
SELECT COUNT(*) FROM users;

# Should return: 0 (empty table)
```

---

## 📊 Monitoring

### Vercel Dashboard
- Go to https://vercel.com/dashboard
- Monitor deployments, analytics, and errors

### Railway Dashboard
- Go to https://railway.app/dashboard
- Monitor logs, metrics, and deployments

### Supabase Dashboard
- Go to https://supabase.com/dashboard
- Monitor database, API usage, and logs

### Upstash Console
- Go to https://console.upstash.com
- Monitor Redis usage and performance

---

## 🆘 Troubleshooting

### Frontend won't load
- Check Vercel build logs
- Verify VITE_API_URL is correct
- Clear browser cache

### API requests fail
- Check Railway logs
- Verify backend is running
- Check CORS configuration
- Verify environment variables

### Database connection fails
- Check Supabase connection string
- Verify IP whitelist (if applicable)
- Check database credentials

### Redis connection fails
- Verify Upstash URL format
- Check Redis credentials
- Verify network connectivity

---

## 💰 Cost Estimate (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $0 |
| Railway | $5 credit | $0-5 |
| Supabase | 500MB storage | $0 |
| Upstash | 10K requests/day | $0 |
| **Total** | | **$0-5** |

---

## 🎯 Next Steps

1. Deploy to free hosting
2. Test all features
3. Set up monitoring
4. Configure custom domain (optional)
5. Launch to users!

---

**Last Updated:** June 2026
**Version:** 2.0.0
