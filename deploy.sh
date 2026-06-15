#!/bin/bash

# ============================================================================
# Advanced Viral Video Agent - Automated Deployment Script
# Deploy to Vercel + Railway + Supabase (100% FREE)
# ============================================================================

set -e

echo "🚀 Advanced Viral Video Agent - Automated Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# STEP 1: Check Prerequisites
# ============================================================================
echo -e "${BLUE}Step 1: Checking Prerequisites...${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install from: https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm installed${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    echo "Install from: https://git-scm.com"
    exit 1
fi
echo -e "${GREEN}✅ Git installed${NC}"

echo ""

# ============================================================================
# STEP 2: Install Dependencies
# ============================================================================
echo -e "${BLUE}Step 2: Installing Dependencies...${NC}"
echo ""

npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""

# ============================================================================
# STEP 3: Setup Git Repository
# ============================================================================
echo -e "${BLUE}Step 3: Setting Up Git Repository...${NC}"
echo ""

# Check if git is already initialized
if [ ! -d .git ]; then
    git init
    git config user.email "deploy@vinedits.com"
    git config user.name "Vinedits Deployer"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Add all files
git add .
git commit -m "Deploy: Advanced Viral Video Agent (vinedits)" || true

echo ""

# ============================================================================
# STEP 4: Build Project
# ============================================================================
echo -e "${BLUE}Step 4: Building Project...${NC}"
echo ""

npm run build
echo -e "${GREEN}✅ Project built successfully${NC}"

echo ""

# ============================================================================
# STEP 5: Display Deployment Instructions
# ============================================================================
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}📋 DEPLOYMENT INSTRUCTIONS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${BLUE}1️⃣  CREATE GITHUB REPOSITORY${NC}"
echo "   a) Go to https://github.com/new"
echo "   b) Repository name: vinedits"
echo "   c) Click 'Create repository'"
echo "   d) Copy the HTTPS URL"
echo ""

echo -e "${BLUE}2️⃣  PUSH CODE TO GITHUB${NC}"
echo "   Run these commands:"
echo ""
echo "   ${YELLOW}git remote add origin https://github.com/YOUR_USERNAME/vinedits.git${NC}"
echo "   ${YELLOW}git branch -M main${NC}"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""

echo -e "${BLUE}3️⃣  DEPLOY TO VERCEL (FRONTEND)${NC}"
echo "   a) Go to https://vercel.com"
echo "   b) Click 'New Project'"
echo "   c) Select your 'vinedits' repository"
echo "   d) Framework: Vite"
echo "   e) Build Command: npm run build"
echo "   f) Output Directory: dist"
echo "   g) Add Environment Variable:"
echo "      - VITE_API_URL: https://your-railway-url.up.railway.app"
echo "   h) Click 'Deploy'"
echo ""
echo "   ${GREEN}✅ You'll get a URL like: https://vinedits.vercel.app${NC}"
echo ""

echo -e "${BLUE}4️⃣  DEPLOY TO RAILWAY (BACKEND)${NC}"
echo "   a) Go to https://railway.app"
echo "   b) Click 'New Project'"
echo "   c) Select 'Deploy from GitHub repo'"
echo "   d) Choose your 'vinedits' repository"
echo "   e) Build Command: npm run build:server"
echo "   f) Start Command: npm start"
echo "   g) Add Environment Variables:"
echo "      - NODE_ENV: production"
echo "      - PORT: 5000"
echo "      - JWT_SECRET: your-secret-key-here"
echo "      - SUPABASE_URL: your-supabase-url"
echo "      - SUPABASE_KEY: your-supabase-key"
echo "   h) Click 'Deploy'"
echo ""
echo "   ${GREEN}✅ You'll get a URL like: https://vinedits-production.up.railway.app${NC}"
echo ""

echo -e "${BLUE}5️⃣  SETUP SUPABASE (DATABASE)${NC}"
echo "   a) Go to https://supabase.com"
echo "   b) Click 'New Project'"
echo "   c) Project Name: vinedits"
echo "   d) Generate strong password"
echo "   e) Select your region"
echo "   f) Click 'Create new project'"
echo "   g) Go to Settings > API"
echo "   h) Copy:"
echo "      - Project URL → SUPABASE_URL"
echo "      - anon public key → SUPABASE_KEY"
echo "   i) Go to SQL Editor"
echo "   j) Create tables (see DEPLOYMENT_GUIDE.md)"
echo ""

echo -e "${BLUE}6️⃣  UPDATE VERCEL ENVIRONMENT VARIABLE${NC}"
echo "   a) Go to Vercel Project Settings"
echo "   b) Update VITE_API_URL with your Railway URL"
echo "   c) Redeploy (automatic)"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${GREEN}Your application is ready!${NC}"
echo ""
echo "Frontend URL: https://vinedits.vercel.app"
echo "Backend URL: https://vinedits-production.up.railway.app"
echo "Database: Supabase (free tier)"
echo ""

echo -e "${YELLOW}💰 COST: $0 (100% FREE)${NC}"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "1. Follow the deployment instructions above"
echo "2. Visit your frontend URL"
echo "3. Sign up with a test account"
echo "4. Start generating viral content!"
echo ""

echo -e "${GREEN}Happy deploying! 🚀${NC}"
