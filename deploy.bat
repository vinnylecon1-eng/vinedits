@echo off
REM ============================================================================
REM Advanced Viral Video Agent - Automated Deployment Script (Windows)
REM Deploy to Vercel + Railway + Supabase (100% FREE)
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo  Advanced Viral Video Agent - Automated Deployment
echo ============================================================
echo.

REM ============================================================================
REM STEP 1: Check Prerequisites
REM ============================================================================
echo [Step 1] Checking Prerequisites...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js installed

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)
echo [OK] npm installed

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed
    echo Install from: https://git-scm.com
    pause
    exit /b 1
)
echo [OK] Git installed

echo.

REM ============================================================================
REM STEP 2: Install Dependencies
REM ============================================================================
echo [Step 2] Installing Dependencies...
echo.

call npm install
echo [OK] Dependencies installed

echo.

REM ============================================================================
REM STEP 3: Setup Git Repository
REM ============================================================================
echo [Step 3] Setting Up Git Repository...
echo.

if not exist .git (
    call git init
    call git config user.email "deploy@vinedits.com"
    call git config user.name "Vinedits Deployer"
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

call git add .
call git commit -m "Deploy: Advanced Viral Video Agent (vinedits)" 2>nul || true

echo.

REM ============================================================================
REM STEP 4: Build Project
REM ============================================================================
echo [Step 4] Building Project...
echo.

call npm run build
echo [OK] Project built successfully

echo.

REM ============================================================================
REM STEP 5: Display Deployment Instructions
REM ============================================================================
echo ========================================
echo  DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.

echo 1. CREATE GITHUB REPOSITORY
echo    a) Go to https://github.com/new
echo    b) Repository name: vinedits
echo    c) Click 'Create repository'
echo    d) Copy the HTTPS URL
echo.

echo 2. PUSH CODE TO GITHUB
echo    Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/vinedits.git
echo    git branch -M main
echo    git push -u origin main
echo.

echo 3. DEPLOY TO VERCEL (FRONTEND)
echo    a) Go to https://vercel.com
echo    b) Click 'New Project'
echo    c) Select your 'vinedits' repository
echo    d) Framework: Vite
echo    e) Build Command: npm run build
echo    f) Output Directory: dist
echo    g) Add Environment Variable:
echo       - VITE_API_URL: https://your-railway-url.up.railway.app
echo    h) Click 'Deploy'
echo.
echo    Result: https://vinedits.vercel.app
echo.

echo 4. DEPLOY TO RAILWAY (BACKEND)
echo    a) Go to https://railway.app
echo    b) Click 'New Project'
echo    c) Select 'Deploy from GitHub repo'
echo    d) Choose your 'vinedits' repository
echo    e) Build Command: npm run build:server
echo    f) Start Command: npm start
echo    g) Add Environment Variables:
echo       - NODE_ENV: production
echo       - PORT: 5000
echo       - JWT_SECRET: your-secret-key-here
echo       - SUPABASE_URL: your-supabase-url
echo       - SUPABASE_KEY: your-supabase-key
echo    h) Click 'Deploy'
echo.
echo    Result: https://vinedits-production.up.railway.app
echo.

echo 5. SETUP SUPABASE (DATABASE)
echo    a) Go to https://supabase.com
echo    b) Click 'New Project'
echo    c) Project Name: vinedits
echo    d) Generate strong password
echo    e) Select your region
echo    f) Click 'Create new project'
echo    g) Go to Settings ^> API
echo    h) Copy credentials to Railway environment variables
echo.

echo 6. UPDATE VERCEL ENVIRONMENT VARIABLE
echo    a) Go to Vercel Project Settings
echo    b) Update VITE_API_URL with your Railway URL
echo    c) Redeploy (automatic)
echo.

echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.

echo Your application is ready!
echo.
echo Frontend URL: https://vinedits.vercel.app
echo Backend URL: https://vinedits-production.up.railway.app
echo Database: Supabase (free tier)
echo.

echo COST: $0 (100%% FREE)
echo.

echo Next Steps:
echo 1. Follow the deployment instructions above
echo 2. Visit your frontend URL
echo 3. Sign up with a test account
echo 4. Start generating viral content!
echo.

echo Happy deploying!
echo.

pause
