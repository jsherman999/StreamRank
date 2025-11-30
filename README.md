# iRankThee

iRankThee is a web application that helps users discover and search for movies and TV shows across popular streaming platforms (Netflix, HBO Max, Apple TV+, etc.). It leverages the **Google Gemini API** (specifically the `gemini-2.5-flash` model with Google Search grounding) to fetch real-time availability and Rotten Tomatoes scores.

## Features

- **Trending Lists**: View top-rated content for major streaming services
- **Deep Search**: Search specific titles within a service's catalog to find hidden gems
- **AI-Powered**: Uses Google Gemini to gather and synthesize data from the web
- **Smart Ranking**: Sort results by Critic Score or Audience Score
- **Consistent UI**: Beautiful, dark-themed interface built with Tailwind CSS
- **Mac M4 Pro Optimized**: Fully compatible with Apple Silicon architecture

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI/Backend**: Google Gemini API (`@google/genai` SDK)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Web Server**: Nginx (for containerized deployment)
- **Container Runtime**: Podman (optimized for macOS)

---

## 🚀 Quick Start (Mac Mini M4 Pro)

### Option 1: Standard Installation (Recommended for Development)

```bash
# Make the installation script executable
chmod +x install.sh

# Run the automated installation
./install.sh

# Configure your API key
nano .env  # or use your preferred editor

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Option 2: Podman Container (Recommended for Production)

```bash
# Make the deployment script executable
chmod +x deploy-podman.sh

# Configure your API key first
cp .env.example .env
nano .env  # Add your API_KEY

# Deploy with Podman
./deploy-podman.sh
```

Visit `http://localhost:8080`

---

## 📋 Prerequisites

### For Standard Installation:
- **macOS** (optimized for Mac Mini M4 Pro)
- **Homebrew** (will be installed automatically if not present)
- **Node.js 18+** (will be installed via Homebrew if not present)

### For Podman Installation:
- **macOS** (optimized for Mac Mini M4 Pro)
- **Homebrew** (required)
- **Podman** (will be installed automatically by the script)
- **4GB+ RAM** recommended for Podman machine
- **10GB+ disk space** for container images

---

## 🔧 Detailed Setup Instructions

### Standard Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/jsherman999/iRankThee.git
cd iRankThee
```

#### 2. Get Your Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for the next step

#### 3. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file and add your API key
nano .env
```

Your `.env` file should look like:
```
API_KEY=your_actual_google_gemini_api_key_here
```

#### 4. Install Dependencies

**Automated (Recommended):**
```bash
chmod +x install.sh
./install.sh
```

**Manual:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install project dependencies
npm install
```

#### 5. Run the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm run preview
```

#### 6. Access the Application
Open your browser and navigate to:
- Development: `http://localhost:5173`
- Preview: `http://localhost:4173`

---

### Podman Container Installation

#### 1. Prerequisites Setup
The deployment script will automatically install Podman if needed, but you can install it manually:

```bash
# Install Podman via Homebrew
brew install podman

# Initialize Podman machine (optimized for M4 Pro)
podman machine init --cpus 4 --memory 4096 --disk-size 50

# Start Podman machine
podman machine start
```

#### 2. Configure Environment
```bash
# Copy and edit the environment file
cp .env.example .env
nano .env  # Add your API_KEY
```

#### 3. Deploy with Script (Recommended)
```bash
# Make script executable
chmod +x deploy-podman.sh

# Deploy
./deploy-podman.sh
```

#### 4. Manual Podman Deployment
```bash
# Build the image for ARM64 (Apple Silicon)
podman build --platform linux/arm64 -t irankthee-ai:latest .

# Run the container
podman run -d \
  --name irankthee-ai \
  -p 8080:80 \
  --env-file .env \
  --restart unless-stopped \
  irankthee-ai:latest
```

#### 5. Using Podman Compose
```bash
# Start with compose
podman-compose up -d

# View logs
podman-compose logs -f

# Stop
podman-compose down
```

#### 6. Access the Application
Open your browser and navigate to: `http://localhost:8080`

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `./install.sh` | Automated installation for macOS |
| `./uninstall.sh` | Clean up node_modules and build artifacts |
| `./deploy-podman.sh` | Build and deploy with Podman |

---

## 🐳 Podman Container Management

### Useful Commands

```bash
# View running containers
podman ps

# View logs
podman logs -f irankthee-ai

# Stop container
podman stop irankthee-ai

# Start container
podman start irankthee-ai

# Restart container
podman restart irankthee-ai

# Remove container
podman rm -f irankthee-ai

# Access container shell
podman exec -it irankthee-ai /bin/sh

# View container stats
podman stats irankthee-ai

# Inspect container
podman inspect irankthee-ai
```

### Podman Machine Management

```bash
# Check machine status
podman machine list

# Stop machine
podman machine stop

# Start machine
podman machine start

# SSH into machine
podman machine ssh

# Remove machine (if needed)
podman machine rm
```

---

## 🌐 Deployment Options

### Local Production Server (Mac Mini)
Perfect for running on your Mac Mini M4 Pro as a home server:

1. Use the Podman deployment method
2. Configure to start on boot:
```bash
# Create launch agent (macOS)
mkdir -p ~/Library/LaunchAgents
```

Create `~/Library/LaunchAgents/com.irankthee.plist`:
```xml
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
    <true/>
</dict>
</plist>
```

Load the agent:
```bash
launchctl load ~/Library/LaunchAgents/com.irankthee.plist
```

### Cloud Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# API_KEY=your_google_gemini_api_key
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variable in Netlify dashboard:
# API_KEY=your_google_gemini_api_key
```

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

---

## 🔍 Troubleshooting

### Common Issues

**Issue: "API_KEY is not defined"**
- Ensure `.env` file exists with `API_KEY=your_key`
- Restart the development server after creating/editing `.env`

**Issue: Podman machine won't start**
```bash
# Remove and recreate machine
podman machine stop
podman machine rm
podman machine init --cpus 4 --memory 4096 --disk-size 50
podman machine start
```

**Issue: Port already in use**
```bash
# For standard installation (port 5173)
lsof -ti:5173 | xargs kill -9

# For Podman (port 8080)
lsof -ti:8080 | xargs kill -9
```

**Issue: Node modules errors**
```bash
# Clean reinstall
./uninstall.sh
./install.sh
```

**Issue: Podman build fails on M4 Pro**
- Ensure you're using `--platform linux/arm64` flag
- Update Podman: `brew upgrade podman`

---

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your Google Gemini API key confidential
- For production deployments, use environment variables in your hosting platform
- The container runs as a non-root user for security

---

## 📊 Performance Optimization (M4 Pro)

The application is optimized for Apple Silicon:

- **Podman** uses ARM64 images for native performance
- **Node.js** runs natively on ARM64
- **Vite** provides fast HMR and optimized builds
- **Nginx** in container is compiled for ARM64

Expected performance:
- Cold start: < 2 seconds
- HMR updates: < 100ms
- Production build: < 30 seconds

---

## 📝 Project Structure

```
iRankThee/
├── components/          # React components
├── services/           # API services (Gemini)
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── Dockerfile         # Container image definition
├── nginx.conf         # Nginx web server config
├── docker-compose.yml # Podman compose configuration
├── install.sh         # macOS installation script
├── deploy-podman.sh   # Podman deployment script
└── .env.example       # Environment variables template
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT

---

## 👤 Author

AI Engineer - iRankThee AI

---

## 🙏 Acknowledgments

- Google Gemini API for AI-powered search
- Rotten Tomatoes for review scores
- React and Vite communities
- Podman for containerization
