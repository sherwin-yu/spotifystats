import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import statsRoutes from './routes/stats';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Spotify Stats API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});