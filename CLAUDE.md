# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Spotify stats application with separate frontend and backend directories:
- **Frontend**: React 19 + TypeScript using Create React App
- **Backend**: Node.js + Express + TypeScript
- **Authentication**: Spotify OAuth2 flow
- **API Integration**: Spotify Web API for user stats

## Development Commands

### Running the Application
```bash
# Run both frontend and backend concurrently
npm run dev

# Run individually
npm run dev:backend   # Backend on port 3001
npm run dev:frontend  # Frontend on port 3000
```

### Building and Production
```bash
# Build both frontend and backend
npm run build

# Start production server (backend only)
npm start
```

### Individual Package Commands
```bash
# Backend (uses nodemon for hot reload)
cd backend && npm run dev
cd backend && npm run build
cd backend && npm start

# Frontend (React development server)
cd frontend && npm start
cd frontend && npm run build
cd frontend && npm run test
```

## Architecture

### Monorepo Structure
- **Root**: Contains workspace scripts using `concurrently`
- **backend/**: Express API server with Spotify integration
- **frontend/**: React SPA with routing and authentication

### Backend Architecture
- `src/index.ts`: Express server entry point with CORS configuration
- `src/routes/`: API endpoints (`auth.ts`, `stats.ts`)
- `src/utils/spotify.ts`: Spotify API utilities and token handling
- `src/types/spotify.ts`: TypeScript interfaces for Spotify API responses

### Frontend Architecture
- `src/App.tsx`: Main router with authentication state management
- `src/components/`: Reusable UI components (Login, TopArtists, TopTracks, UserProfile)
- `src/pages/`: Page components (CallbackPage, Dashboard)
- `src/hooks/useAuth.ts`: Custom authentication hook
- `src/services/api.ts`: Axios-based API client
- `src/types/spotify.ts`: Frontend TypeScript types (may differ from backend)

### Authentication Flow
1. Frontend requests auth URL from `/auth/login`
2. User redirects to Spotify authorization
3. Spotify redirects to `/callback` with code
4. Frontend posts code to `/auth/callback` 
5. Backend exchanges code for access token
6. Token stored in localStorage, user redirected to dashboard

## Environment Configuration

### Required Environment Variables
**Backend (.env)**:
- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app client secret  
- `SPOTIFY_REDIRECT_URI`: OAuth callback URI (http://localhost:3000/callback)
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

**Frontend (.env)**:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3001)

## API Endpoints

- `GET /auth/login`: Returns Spotify authorization URL
- `POST /auth/callback`: Exchanges auth code for access token
- `GET /stats/user`: Current user profile data
- `GET /stats/top-tracks`: User's top tracks with time range query param
- `GET /stats/top-artists`: User's top artists with time range query param
- `GET /stats/recently-played`: Recently played tracks

## Development Notes

- Both frontend and backend use TypeScript with separate tsconfig.json files
- Frontend uses React Router for client-side routing
- Backend uses Express with CORS enabled for development
- No linting or testing scripts configured beyond React's defaults
- Spotify API scopes: `user-read-private`, `user-read-email`, `user-top-read`, `user-read-recently-played`