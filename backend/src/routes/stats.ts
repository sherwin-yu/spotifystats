import { Router, Request, Response } from 'express';
import { SpotifyAPI } from '../utils/spotify';

const router = Router();

const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  req.body.accessToken = token;
  next();
};

router.use(authenticateToken);

router.get('/user', async (req: Request, res: Response) => {
  try {
    const spotify = new SpotifyAPI(req.body.accessToken);
    const user = await spotify.getCurrentUser();
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.get('/top-tracks', async (req: Request, res: Response) => {
  try {
    const { time_range = 'medium_term', limit = '20' } = req.query;
    const spotify = new SpotifyAPI(req.body.accessToken);
    
    const topTracks = await spotify.getTopTracks(
      time_range as 'short_term' | 'medium_term' | 'long_term',
      parseInt(limit as string)
    );
    
    res.json(topTracks);
  } catch (error) {
    console.error('Get top tracks error:', error);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

router.get('/top-artists', async (req: Request, res: Response) => {
  try {
    const { time_range = 'medium_term', limit = '20' } = req.query;
    const spotify = new SpotifyAPI(req.body.accessToken);
    
    const topArtists = await spotify.getTopArtists(
      time_range as 'short_term' | 'medium_term' | 'long_term',
      parseInt(limit as string)
    );
    
    res.json(topArtists);
  } catch (error) {
    console.error('Get top artists error:', error);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

router.get('/recently-played', async (req: Request, res: Response) => {
  try {
    const { limit = '20' } = req.query;
    const spotify = new SpotifyAPI(req.body.accessToken);
    
    const recentTracks = await spotify.getRecentlyPlayed(parseInt(limit as string));
    
    res.json(recentTracks);
  } catch (error) {
    console.error('Get recently played error:', error);
    res.status(500).json({ error: 'Failed to fetch recently played tracks' });
  }
});

export default router;