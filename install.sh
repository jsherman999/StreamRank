#!/bin/bash
# Installation script for macOS (Mac Mini M4 Pro)
# This script sets up the iRankThee AI application with all dependencies

set -e  # Exit on error

echo "🚀 iRankThee AI - macOS Installation Script"
echo "=============================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Error: This script is designed for macOS only${NC}"
    exit 1
fi

# Check if running on Apple Silicon
ARCH=$(uname -m)
if [[ "$ARCH" != "arm64" ]]; then
    echo -e "${YELLOW}⚠️  Warning: This script is optimized for Apple Silicon (M-series chips)${NC}"
    echo -e "${YELLOW}   Your architecture: $ARCH${NC}"
    echo ""
fi

echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}⚠️  Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon
    if [[ "$ARCH" == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✓ Homebrew is installed${NC}"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Installing Node.js...${NC}"
    brew install node
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm not found${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm is installed: $NPM_VERSION${NC}"
fi

echo ""
echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}🔧 Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created .env file from .env.example${NC}"
    echo -e "${YELLOW}   Please edit .env and add your Google Gemini API key${NC}"
    echo -e "${YELLOW}   Get your API key from: https://aistudio.google.com/app/apikey${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "   1. Edit .env file and add your API_KEY"
echo "   2. Run: npm run dev (for development)"
echo "   3. Run: npm run build (for production build)"
echo "   4. Run: npm run preview (to preview production build)"
echo ""
echo -e "${BLUE}🌐 The app will be available at: http://localhost:5173${NC}"
echo ""
