#!/bin/bash
# Auto-start configuration script for iRankThee AI on macOS
# This creates a launch agent to start the Podman container on boot

set -e

echo "🚀 iRankThee AI - Auto-Start Setup"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

LAUNCH_AGENT_DIR="$HOME/Library/LaunchAgents"
PLIST_FILE="$LAUNCH_AGENT_DIR/com.irankthee.ai.plist"

echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo -e "${RED}❌ Error: Podman is not installed${NC}"
    echo "Please run ./deploy-podman.sh first"
    exit 1
fi

# Check if container exists
if ! podman ps -a | grep -q "irankthee-ai"; then
    echo -e "${RED}❌ Error: irankthee-ai container not found${NC}"
    echo "Please run ./deploy-podman.sh first"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENT_DIR"

echo -e "${BLUE}🔧 Creating launch agent...${NC}"

# Create the plist file
cat > "$PLIST_FILE" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.irankthee.ai</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/podman</string>
        <string>start</string>
        <string>irankthee-ai</string>
    </array>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>
    
    <key>StandardOutPath</key>
    <string>/tmp/irankthee-ai.log</string>
    
    <key>StandardErrorPath</key>
    <string>/tmp/irankthee-ai.error.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
EOF

echo -e "${GREEN}✓ Launch agent created${NC}"
echo ""

echo -e "${BLUE}📝 Loading launch agent...${NC}"

# Unload if already loaded (ignore errors)
launchctl unload "$PLIST_FILE" 2>/dev/null || true

# Load the launch agent
launchctl load "$PLIST_FILE"

echo -e "${GREEN}✓ Launch agent loaded${NC}"
echo ""

echo -e "${GREEN}✅ Auto-start setup complete!${NC}"
echo ""
echo -e "${BLUE}📝 What this means:${NC}"
echo "   - iRankThee AI will start automatically when you log in"
echo "   - The container will restart if it crashes"
echo "   - Logs are written to /tmp/irankthee-ai.log"
echo ""
echo -e "${BLUE}🛠️  Management commands:${NC}"
echo "   Disable auto-start:  launchctl unload $PLIST_FILE"
echo "   Enable auto-start:   launchctl load $PLIST_FILE"
echo "   Remove auto-start:   rm $PLIST_FILE"
echo "   View logs:           tail -f /tmp/irankthee-ai.log"
echo ""
echo -e "${BLUE}🔄 To test, restart your Mac or log out and back in${NC}"
echo ""
