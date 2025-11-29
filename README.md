# StreamRank AI

StreamRank AI is a web application that helps users discover and search for movies and TV shows across popular streaming platforms (Netflix, HBO Max, Apple TV+, etc.). It leverages the **Google Gemini API** (specifically the `gemini-2.5-flash` model with Google Search grounding) to fetch real-time availability and Rotten Tomatoes scores.

## Features

- **Trending Lists**: View top-rated content for major streaming services.
- **Deep Search**: Search specific titles within a service's catalog to find hidden gems.
- **AI-Powered**: Uses Google Gemini to gather and synthesize data from the web.
- **Smart Ranking**: Sort results by Critic Score or Audience Score.
- **Consistent UI**: Beautiful, dark-themed interface built with Tailwind CSS.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI/Backend**: Google Gemini API (`@google/genai` SDK)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/streamrank-ai.git
    cd streamrank-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    You need a Google GenAI API key. Create a `.env` file in the root directory:
    ```
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Deployment (Google Firebase Hosting)

1.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Project**:
    ```bash
    firebase init
    ```
    - Select **Hosting**.
    - Choose "Use an existing project" or "Create a new project".
    - Set `dist` as your public directory.
    - Configure as a single-page app (Yes).

4.  **Build**:
    ```bash
    npm run build
    ```

5.  **Deploy**:
    ```bash
    firebase deploy
    ```

## Deployment (Vercel / Netlify)

This project is ready to be deployed on Vercel or Netlify. Simply connect your Git repository, and the build settings (Framework: Vite, Build Command: `npm run build`, Output Directory: `dist`) should be detected automatically. **Remember to add your `API_KEY` to the environment variables in your hosting dashboard.**

## License

MIT
