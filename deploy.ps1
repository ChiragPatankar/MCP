# ClientSphere Deployment Script (PowerShell)
# This script helps deploy all services

Write-Host "🚀 ClientSphere Deployment Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if user is logged in to Vercel
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
try {
    vercel whoami | Out-Null
    Write-Host "✅ Vercel authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel. Please run: vercel login" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm install
npm run build
Write-Host "✅ Frontend built successfully" -ForegroundColor Green
Write-Host ""

# Deploy frontend
Write-Host "🚀 Deploying frontend to Vercel..." -ForegroundColor Yellow
vercel --prod
Write-Host "✅ Frontend deployed" -ForegroundColor Green
Write-Host ""

# Build Node.js backend
Write-Host "📦 Building Node.js backend..." -ForegroundColor Yellow
Set-Location server
npm install
npm run build
Set-Location ..
Write-Host "✅ Node.js backend built" -ForegroundColor Green
Write-Host ""

# Build RAG backend (check dependencies)
Write-Host "📦 Checking RAG backend dependencies..." -ForegroundColor Yellow
Set-Location rag-backend
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}
& .\venv\Scripts\python.exe -m pip install -r requirements.txt --quiet
Set-Location ..
Write-Host "✅ RAG backend dependencies checked" -ForegroundColor Green
Write-Host ""

# Git operations
Write-Host "📝 Preparing Git commit..." -ForegroundColor Yellow
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Deploy to production - $(Get-Date -Format 'yyyy-MM-dd')"
}

git add .
try {
    git commit -m $commitMsg
    Write-Host "✅ Changes committed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No changes to commit" -ForegroundColor Yellow
}
Write-Host ""

# Push to GitHub (triggers Render deployment)
Write-Host "📤 Pushing to GitHub (triggers Render deployment)..." -ForegroundColor Yellow
$pushConfirm = Read-Host "Push to GitHub? (y/n)"
if ($pushConfirm -eq "y") {
    try {
        git push origin main
        Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Deployment initiated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Check Vercel dashboard for frontend deployment" -ForegroundColor White
        Write-Host "2. Check Render dashboard for backend deployments" -ForegroundColor White
        Write-Host "3. Update environment variables in Render:" -ForegroundColor White
        Write-Host "   - RAG_BACKEND_URL" -ForegroundColor Gray
        Write-Host "   - FRONTEND_URL" -ForegroundColor Gray
        Write-Host "   - ALLOWED_ORIGINS" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Failed to push. Try manually: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Skipped GitHub push. Deploy manually from Render dashboard." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Green

