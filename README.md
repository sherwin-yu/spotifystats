# Spotify Stats App

A full-stack web application that showcases your Spotify listening statistics, built with React, TypeScript, Node.js, and Express.

## Features

- **User Authentication**: Secure OAuth2 login with Spotify
- **Top Tracks**: View your most played tracks across different time periods
- **Top Artists**: Discover your favorite artists with popularity metrics
- **User Profile**: Display your Spotify profile information
- **Responsive Design**: Mobile-friendly interface with Spotify-themed styling
- **Time Range Filtering**: View stats for last 4 weeks, 6 months, or all time

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- CSS3 with responsive design
- Custom hooks for authentication

### Backend
- Node.js with Express
- TypeScript
- Spotify Web API integration
- OAuth2 authentication flow
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Spotify Developer Account
- Spotify App registered (for Client ID and Secret)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Spotify API:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://localhost:3000/callback` to redirect URIs
   - Copy your Client ID and Client Secret

3. **Environment Configuration:**
   
   Backend (.env):
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Spotify credentials:
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

   Frontend (.env):
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env:
   REACT_APP_API_URL=http://localhost:3001
   ```

4. **Run the application:**
   ```bash
   # From project root - runs both frontend and backend
   npm run dev
   
   # Or run separately:
   npm run dev:backend  # Backend on port 3001
   npm run dev:frontend # Frontend on port 3000
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Click "Login with Spotify"
   - Authorize the app
   - Explore your music stats!

## Project Structure

```
spotify-stats-app/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Spotify API utilities
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   └── package.json
└── package.json             # Root package.json
```

## API Endpoints

- `GET /auth/login` - Get Spotify authorization URL
- `POST /auth/callback` - Exchange code for access token
- `GET /stats/user` - Get current user profile
- `GET /stats/top-tracks` - Get user's top tracks
- `GET /stats/top-artists` - Get user's top artists
- `GET /stats/recently-played` - Get recently played tracks

## Available Scripts

- `npm run dev` - Run both frontend and backend in development
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start production server
- `npm run dev:backend` - Run only backend server
- `npm run dev:frontend` - Run only frontend server

## Features in Detail

### Authentication Flow
1. User clicks "Login with Spotify"
2. Redirected to Spotify authorization page
3. User grants permissions
4. Callback receives authorization code
5. Backend exchanges code for access token
6. Token stored in browser localStorage
7. User redirected to dashboard

### Dashboard Features
- **Profile Tab**: Shows user info, profile picture, and follower count
- **Top Tracks Tab**: Lists favorite songs with album art, duration, and popularity
- **Top Artists Tab**: Grid of favorite artists with genres and stats
- **Time Range Selection**: Filter results by short-term, medium-term, or long-term

### Responsive Design
- Desktop: Full layout with all features
- Tablet: Adjusted grid layouts and navigation
- Mobile: Simplified track display and stacked navigation

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
- `SPOTIFY_REDIRECT_URI` - OAuth redirect URI
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3001)

## Spotify API Permissions

The app requests these Spotify scopes:
- `user-read-private` - Access user profile data
- `user-read-email` - Access user email
- `user-top-read` - Access top artists and tracks
- `user-read-recently-played` - Access recently played tracks

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses React development server
```

### Building for Production
```bash
npm run build  # Builds both frontend and backend
cd backend && npm start  # Starts production server
```

## Troubleshooting

1. **Authentication Issues**:
   - Verify Spotify app redirect URI matches exactly
   - Check client ID and secret are correct
   - Ensure .env files are properly configured

2. **CORS Errors**:
   - Verify FRONTEND_URL in backend .env
   - Check that both servers are running

3. **Build Issues**:
   - Run `npm install` in both backend and frontend directories
   - Ensure Node.js version is 18+

## License

This project is licensed under the ISC License.