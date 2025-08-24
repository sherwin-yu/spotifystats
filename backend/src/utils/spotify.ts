import axios from 'axios';
import { SpotifyUser, TopTracksResponse, TopArtistsResponse } from '../types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export class SpotifyAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${SPOTIFY_API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Spotify API error: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.makeRequest<SpotifyUser>('/me');
  }

  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<TopTracksResponse> {
    return this.makeRequest<TopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<TopArtistsResponse> {
    return this.makeRequest<TopArtistsResponse>(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  async getRecentlyPlayed(limit: number = 20) {
    return this.makeRequest(`/me/player/recently-played?limit=${limit}`);
  }
}

export const generateSpotifyAuthURL = (): string => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID environment variable is required');
  }

  if (!redirectUri) {
    throw new Error('SPOTIFY_REDIRECT_URI environment variable is required');
  }

  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played'
  ].join('%20');

  const state = Math.random().toString(36).substring(2, 15);
  
  return `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}`;
};

export const exchangeCodeForToken = async (code: string): Promise<{
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID environment variable is required');
  }

  if (!clientSecret) {
    throw new Error('SPOTIFY_CLIENT_SECRET environment variable is required');
  }

  if (!redirectUri) {
    throw new Error('SPOTIFY_REDIRECT_URI environment variable is required');
  }

  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }).toString(),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data;
};