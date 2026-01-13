import { v4 as uuidv4 } from 'uuid';
import { GAMES_CONFIG, GAME_QUESTIONS } from '../../games/config/gamesConfig.js';

/**
 * Games Controller
 * Mengelola logika bisnis terkait games
 */

/**
 * Get semua games yang tersedia
 */
export const getAllGames = (req, res) => {
  try {
    const games = Object.values(GAMES_CONFIG).map(game => ({
      ...game,
      url: `/game/${game.id}`
    }));

    res.json({
      success: true,
      data: games,
      total: games.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get detail game berdasarkan ID
 */
export const getGameById = (req, res) => {
  try {
    const { gameId } = req.params;
    const game = GAMES_CONFIG[gameId];

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game tidak ditemukan'
      });
    }

    // Ambil pertanyaan game jika ada
    const questions = GAME_QUESTIONS[gameId] || [];

    res.json({
      success: true,
      data: {
        ...game,
        questions,
        startUrl: `/game/${gameId}`,
        playUrl: `/api/gameplay/${gameId}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get games berdasarkan kategori
 */
export const getGamesByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const games = Object.values(GAMES_CONFIG)
      .filter(game => game.category === category);

    if (games.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tidak ada game dengan kategori: ${category}`
      });
    }

    res.json({
      success: true,
      category,
      data: games,
      total: games.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get games berdasarkan usia anak
 */
export const getGamesByAge = (req, res) => {
  try {
    const { age } = req.params;
    const games = Object.values(GAMES_CONFIG)
      .filter(game => {
        const [minAge, maxAge] = game.ageRange.split('-').map(Number);
        return age >= minAge && age <= maxAge;
      });

    if (games.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tidak ada game yang sesuai untuk usia: ${age} tahun`
      });
    }

    res.json({
      success: true,
      age,
      data: games,
      total: games.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get kategori games yang tersedia
 */
export const getGameCategories = (req, res) => {
  try {
    const categories = [...new Set(
      Object.values(GAMES_CONFIG).map(game => game.category)
    )];

    const categoryStats = categories.map(category => ({
      name: category,
      count: Object.values(GAMES_CONFIG).filter(g => g.category === category).length
    }));

    res.json({
      success: true,
      data: categoryStats,
      total: categoryStats.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getAllGames,
  getGameById,
  getGamesByCategory,
  getGamesByAge,
  getGameCategories
};
