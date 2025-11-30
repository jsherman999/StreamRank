#!/bin/bash
# Uninstallation script for iRankThee AI

set -e

echo "🗑️  iRankThee AI - Uninstall Script"
echo "====================================="
echo ""

read -p "This will remove node_modules and build artifacts. Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstall cancelled."
    exit 0
fi

echo "Removing node_modules..."
rm -rf node_modules

echo "Removing build artifacts..."
rm -rf dist
rm -rf dist-ssr

echo "Removing lock files..."
rm -f package-lock.json

echo ""
echo "✅ Uninstall complete!"
echo ""
echo "Note: .env file was preserved. Delete it manually if needed."
echo "To reinstall, run: ./install.sh"
echo ""
