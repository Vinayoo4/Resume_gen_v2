# Vibe Resume

A modern, offline-capable PWA for creating interactive, one-page portfolios with no coding required. Build your resume, customize themes, and share it with the world.

## Architecture
- **Frontend**: Vue 3 + Vite, Tailwind CSS, Pinia, Vue Router
- **Backend**: Express, TypeScript
- **Storage**: Local JSON-based file storage
- **Security**: Salted hashes (PBKDF2), JWT

## Quick Start (Development)
1. Install dependencies:
   `npm install`
2. Start the development environment (both backend and frontend run concurrently):
   `npm run dev`
   - Frontend available at `http://localhost:5173`
   - Backend available at `http://localhost:3000`

## Production Build and Setup
1. Build both projects:
   `npm run build`
2. Start the production backend server (this also serves the frontend):
   `npm start`

*Note: Ensure your production environment provides the correct `.env` files or sets the appropriate variables, especially `VITE_API_URL` for the frontend and `JWT_SECRET` for the backend.*

## PWA Capabilities
- Features `manifest.webmanifest` and caching ServiceWorker.
- Capable of being installed as a standalone app.
- Includes offline fallback pages.
- Allows editing and saving resume drafts while offline; changes automatically sync to the server when reconnected.
