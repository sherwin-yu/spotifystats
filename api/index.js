const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true
}));
app.use(express.json());

// Spotify configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Utility functions for Spotify API
const getSpotifyToken = async (code) => {
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

const makeSpotifyRequest = async (url, accessToken) => {
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Auth routes
app.get('/api/auth/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played';
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${SPOTIFY_CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(scopes)}`;
  
  res.json({ authUrl });
});

app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const tokenData = await getSpotifyToken(code);
    res.json(tokenData);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// Stats routes
app.get('/api/stats/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const accessToken = authHeader.split(' ')[1];
  
  try {
    const userData = await makeSpotifyRequest('https://api.spotify.com/v1/me', accessToken);
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch user data' 
    });
  }
});

app.get('/api/stats/top-tracks', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const accessToken = authHeader.split(' ')[1];
  const timeRange = req.query.time_range || 'medium_term';
  const limit = req.query.limit || '20';
  
  try {
    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
    const topTracks = await makeSpotifyRequest(url, accessToken);
    res.json(topTracks);
  } catch (error) {
    console.error('Error fetching top tracks:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch top tracks' 
    });
  }
});

app.get('/api/stats/top-artists', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const accessToken = authHeader.split(' ')[1];
  const timeRange = req.query.time_range || 'medium_term';
  const limit = req.query.limit || '20';
  
  try {
    const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`;
    const topArtists = await makeSpotifyRequest(url, accessToken);
    res.json(topArtists);
  } catch (error) {
    console.error('Error fetching top artists:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch top artists' 
    });
  }
});

app.get('/api/stats/recently-played', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const accessToken = authHeader.split(' ')[1];
  const limit = req.query.limit || '20';
  
  try {
    const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
    const recentlyPlayed = await makeSpotifyRequest(url, accessToken);
    res.json(recentlyPlayed);
  } catch (error) {
    console.error('Error fetching recently played:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch recently played tracks' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Spotify Stats API is running' });
});

// Default handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;