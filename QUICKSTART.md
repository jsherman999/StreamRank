# iRankThee - Quick Start Guide

This guide will help you get iRankThee running on your Mac Mini M4 Pro in under 5 minutes.

## Prerequisites Check

Before starting, ensure you have:
- Mac Mini M4 Pro (or any macOS with Apple Silicon)
- Internet connection
- Google Gemini API key (get free at https://aistudio.google.com/app/apikey)

## Installation Methods

### Method 1: Standard Installation (Development)

Best for: Development, testing, and local use

```bash
# 1. Navigate to project directory
cd /Users/jay/iRankThee/iRankThee

# 2. Run automated installation
./install.sh

# 3. Configure API key
nano .env  # Add: API_KEY=your_key_here

# 4. Start development server
npm run dev

# 5. Open browser
# Visit: http://localhost:5173
```

**Time to complete:** ~3-5 minutes (depending on internet speed)

### Method 2: Podman Container (Production)

Best for: Production deployment, always-on server

```bash
# 1. Navigate to project directory
cd /Users/jay/iRankThee/iRankThee

# 2. Configure API key
cp .env.example .env
nano .env  # Add: API_KEY=your_key_here

# 3. Deploy container
./deploy-podman.sh

# 4. Open browser
# Visit: http://localhost:8080
```

**Time to complete:** ~5-10 minutes (first time, includes Podman machine setup)

## Troubleshooting

### Installation Fails
```bash
# Clean and retry
./uninstall.sh
./install.sh
```

### API Key Issues
- Ensure `.env` file exists in project root
- No spaces around the `=` sign
- No quotes around the API key
- Format: `API_KEY=AIzaSyAbc123def456ghi789jkl`

### Port Already in Use
```bash
# Kill process on port 5173 (dev server)
lsof -ti:5173 | xargs kill -9

# Kill process on port 8080 (Podman)
lsof -ti:8080 | xargs kill -9
```

### Podman Issues
```bash
# Reset Podman machine
podman machine stop
podman machine rm
podman machine init --cpus 4 --memory 4096
podman machine start
```

## What's Next?

### Daily Usage
```bash
# Development mode
npm run dev

# Stop with Ctrl+C
```

### Production Container
```bash
# View logs
podman logs -f irankthee

# Stop container
podman stop irankthee

# Start container
podman start irankthee
```

### Building for Production
```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

## Getting Help

- Check full documentation: `README.md`
- View container logs: `podman logs irankthee`
- Check browser console (F12) for errors
- Ensure API key is valid at https://aistudio.google.com/app/apikey

## Common First-Time Questions

**Q: Which installation method should I use?**
A: Use standard installation for development. Use Podman for production/server use.

**Q: Will this work on Intel Mac?**
A: Yes, but it's optimized for Apple Silicon. Remove `--platform linux/arm64` from Podman commands.

**Q: How much does the Google Gemini API cost?**
A: Gemini Flash has a generous free tier. Check current pricing at ai.google.dev

**Q: Can I access this from other devices?**
A: Yes! Replace `localhost` with your Mac's IP address (find with: `ifconfig | grep inet`)

**Q: How do I make it start automatically on boot?**
A: See "Local Production Server" section in README.md for launchd configuration.

## Success Checklist

- [ ] Scripts are executable (`chmod +x` completed)
- [ ] `.env` file exists with valid API_KEY
- [ ] Node.js installed (check: `node -v`)
- [ ] npm installed (check: `npm -v`)
- [ ] Can access http://localhost:5173 or http://localhost:8080
- [ ] Application loads and shows streaming services
- [ ] Can search for shows and see results

## Next Steps

1. ✅ Get the app running
2. 📖 Read the full README.md for advanced features
3. 🎨 Customize for your needs
4. 🚀 Deploy to cloud (optional)
5. ⭐ Star the repo on GitHub!

---

**Need help?** Check the Troubleshooting section in README.md or open an issue on GitHub.
