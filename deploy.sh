#!/bin/bash

# ClientSphere Deployment Script
# This script helps deploy all services

set -e

echo "🚀 ClientSphere Deployment Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo -e "${YELLOW}Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Vercel. Please run: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel authenticated${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Deploy frontend
echo -e "${YELLOW}🚀 Deploying frontend to Vercel...${NC}"
vercel --prod
echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

# Build Node.js backend
echo -e "${YELLOW}📦 Building Node.js backend...${NC}"
cd server
npm install
npm run build
cd ..
echo -e "${GREEN}✅ Node.js backend built${NC}"
echo ""

# Build RAG backend (check dependencies)
echo -e "${YELLOW}📦 Checking RAG backend dependencies...${NC}"
cd rag-backend
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || true
pip install -r requirements.txt --quiet
cd ..
echo -e "${GREEN}✅ RAG backend dependencies checked${NC}"
echo ""

# Git operations
echo -e "${YELLOW}📝 Preparing Git commit...${NC}"
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy to production - $(date +%Y-%m-%d)"
fi

git add .
git commit -m "$commit_msg" || echo "No changes to commit"
echo -e "${GREEN}✅ Changes committed${NC}"
echo ""

# Push to GitHub (triggers Render deployment)
echo -e "${YELLOW}📤 Pushing to GitHub (triggers Render deployment)...${NC}"
read -p "Push to GitHub? (y/n): " push_confirm
if [ "$push_confirm" = "y" ]; then
    git push origin main || git push origin master
    echo -e "${GREEN}✅ Pushed to GitHub${NC}"
    echo ""
    echo -e "${GREEN}🎉 Deployment initiated!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Check Vercel dashboard for frontend deployment"
    echo "2. Check Render dashboard for backend deployments"
    echo "3. Update environment variables in Render:"
    echo "   - RAG_BACKEND_URL"
    echo "   - FRONTEND_URL"
    echo "   - ALLOWED_ORIGINS"
else
    echo -e "${YELLOW}⚠️  Skipped GitHub push. Deploy manually from Render dashboard.${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment script completed!${NC}"

