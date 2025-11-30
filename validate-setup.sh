#!/bin/bash
# Validation script to check if iRankThee AI is ready for deployment

set -e

echo "🔍 iRankThee AI - Deployment Validation"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((ERRORS++))
    fi
}

# Function to check executable
check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 (executable)"
    else
        echo -e "${YELLOW}⚠${NC} $1 (not executable)"
        ((WARNINGS++))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((ERRORS++))
    fi
}

echo "📁 Checking core files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "vite.config.ts"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file "index.html"
check_file "index.tsx"
check_file "index.css"
check_file "App.tsx"
check_file "types.ts"
check_file "constants.ts"

echo ""
echo "📁 Checking component files..."
check_dir "components"
check_file "components/ErrorMessage.tsx"
check_file "components/Header.tsx"
check_file "components/Loader.tsx"
check_file "components/ScoreBadge.tsx"
check_file "components/SearchBar.tsx"
check_file "components/ServiceTabs.tsx"
check_file "components/ShowCard.tsx"
check_file "components/ShowList.tsx"
check_file "components/SortControls.tsx"

echo ""
echo "📁 Checking service files..."
check_dir "services"
check_file "services/geminiService.ts"

echo ""
echo "📁 Checking deployment files..."
check_file ".env.example"
check_file ".gitignore"
check_file ".dockerignore"
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file "nginx.conf"

echo ""
echo "📁 Checking installation scripts..."
check_executable "install.sh"
check_executable "uninstall.sh"
check_executable "deploy-podman.sh"
check_executable "setup-autostart.sh"

echo ""
echo "📁 Checking documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "DEPLOYMENT_SUMMARY.md"

echo ""
echo "🔧 Checking system prerequisites..."

# Check for required commands
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Node.js not installed (will be installed by install.sh)"
    ((WARNINGS++))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${YELLOW}⚠${NC} npm not installed (will be installed with Node.js)"
    ((WARNINGS++))
fi

if command -v brew &> /dev/null; then
    echo -e "${GREEN}✓${NC} Homebrew installed"
else
    echo -e "${YELLOW}⚠${NC} Homebrew not installed (will be installed by install.sh)"
    ((WARNINGS++))
fi

if command -v podman &> /dev/null; then
    PODMAN_VERSION=$(podman --version)
    echo -e "${GREEN}✓${NC} Podman: $PODMAN_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Podman not installed (will be installed by deploy-podman.sh)"
    ((WARNINGS++))
fi

echo ""
echo "🔐 Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    if grep -q "API_KEY=your" .env 2>/dev/null; then
        echo -e "${YELLOW}⚠${NC} .env file contains placeholder API key"
        echo "  → Please update .env with your actual Google Gemini API key"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓${NC} .env file appears configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found"
    echo "  → Run: cp .env.example .env"
    echo "  → Then add your Google Gemini API key"
    ((WARNINGS++))
fi

echo ""
echo "📊 Architecture check..."
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    echo -e "${GREEN}✓${NC} Running on Apple Silicon (ARM64) - Optimized!"
else
    echo -e "${YELLOW}⚠${NC} Not running on Apple Silicon (Architecture: $ARCH)"
    echo "  → App will work but may not be fully optimized"
    ((WARNINGS++))
fi

echo ""
echo "========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your app is ready to deploy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env: cp .env.example .env && nano .env"
    echo "  2. Choose installation method:"
    echo "     - Standard: ./install.sh && npm run dev"
    echo "     - Podman: ./deploy-podman.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found. App should work but check warnings above.${NC}"
    echo ""
    echo "The warnings above are typically fine for first-time setup."
    echo "Proceed with installation and resolve warnings as needed."
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found. Please fix before deploying.${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) also found.${NC}"
    fi
    exit 1
fi
