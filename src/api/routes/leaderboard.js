import express from 'express';
import {
  getLeaderboard,
  getPlayerStats,
  addScore
} from '../controllers/leaderboardController.js';

const router = express.Router();

// Get leaderboard
router.get('/', getLeaderboard);

// Get player stats
router.get('/:playerId', getPlayerStats);

// Add score
router.post('/score', addScore);

export default router;
