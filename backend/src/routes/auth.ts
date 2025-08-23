import { Router, Request, Response } from 'express';
import { generateSpotifyAuthURL, exchangeCodeForToken } from '../utils/spotify';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  try {
    const authUrl = generateSpotifyAuthURL();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.post('/callback', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokenData = await exchangeCodeForToken(code);
    
    res.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

export default router;