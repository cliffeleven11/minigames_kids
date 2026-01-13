import express from 'express';
import {
  getAllGames,
  getGameById,
  getGamesByCategory,
  getGamesByAge,
  getGameCategories
} from '../controllers/gamesController.js';

const router = express.Router();

// Get semua games
router.get('/', getAllGames);

// Get game categories
router.get('/categories', getGameCategories);

// Get games by category
router.get('/category/:category', getGamesByCategory);

// Get games by age
router.get('/age/:age', getGamesByAge);

// Get detail game
router.get('/:gameId', getGameById);

export default router;
