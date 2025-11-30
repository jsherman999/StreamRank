#!/bin/bash
# Podman deployment script for macOS
# This script builds and runs iRankThee AI in a Podman container

set -e

echo "🐳 iRankThee AI - Podman Deployment Script"
echo "============================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
CONTAINER_NAME="irankthee-ai"
IMAGE_NAME="irankthee-ai"
IMAGE_TAG="latest"
HOST_PORT=8080
CONTAINER_PORT=80

echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo -e "${YELLOW}⚠️  Podman not found. Installing Podman...${NC}"
    brew install podman
    echo -e "${GREEN}✓ Podman installed${NC}"
else
    PODMAN_VERSION=$(podman --version)
    echo -e "${GREEN}✓ Podman is installed: $PODMAN_VERSION${NC}"
fi

# Initialize Podman machine if needed
if ! podman machine list | grep -q "Currently running"; then
    echo -e "${BLUE}🔧 Initializing Podman machine...${NC}"
    
    # Check if machine exists
    if ! podman machine list | grep -q "podman-machine-default"; then
        echo "Creating Podman machine..."
        podman machine init --cpus 4 --memory 4096 --disk-size 50
    fi
    
    echo "Starting Podman machine..."
    podman machine start
    echo -e "${GREEN}✓ Podman machine started${NC}"
else
    echo -e "${GREEN}✓ Podman machine is running${NC}"
fi

echo ""
echo -e "${BLUE}🏗️  Building Docker image...${NC}"
podman build --platform linux/arm64 -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo ""
echo -e "${BLUE}🛑 Stopping existing container (if any)...${NC}"
podman stop ${CONTAINER_NAME} 2>/dev/null || true
podman rm ${CONTAINER_NAME} 2>/dev/null || true

echo ""
echo -e "${BLUE}🚀 Starting container...${NC}"
podman run -d \
    --name ${CONTAINER_NAME} \
    -p ${HOST_PORT}:${CONTAINER_PORT} \
    --env-file .env \
    --restart unless-stopped \
    ${IMAGE_NAME}:${IMAGE_TAG}

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📝 Container Information:${NC}"
echo "   Container Name: ${CONTAINER_NAME}"
echo "   Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "   Port: ${HOST_PORT}"
echo ""
echo -e "${BLUE}🌐 Access the application at: http://localhost:${HOST_PORT}${NC}"
echo ""
echo -e "${BLUE}📊 Useful commands:${NC}"
echo "   View logs:     podman logs -f ${CONTAINER_NAME}"
echo "   Stop:          podman stop ${CONTAINER_NAME}"
echo "   Start:         podman start ${CONTAINER_NAME}"
echo "   Restart:       podman restart ${CONTAINER_NAME}"
echo "   Remove:        podman rm -f ${CONTAINER_NAME}"
echo "   Shell access:  podman exec -it ${CONTAINER_NAME} /bin/sh"
echo ""
