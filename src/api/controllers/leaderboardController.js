/**
 * Leaderboard Controller
 * Mengelola papan peringkat dan statistik pemain
 */

// Temporary in-memory storage
let leaderboard = new Map();

/**
 * Get leaderboard
 */
export const getLeaderboard = (req, res) => {
  try {
    const { gameId, limit = 10 } = req.query;

    let scores = Array.from(leaderboard.values())
      .flat()
      .sort((a, b) => b.score - a.score);

    if (gameId) {
      scores = scores.filter(s => s.gameId === gameId);
    }

    scores = scores.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: scores,
      total: scores.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get player stats
 */
export const getPlayerStats = (req, res) => {
  try {
    const { playerId } = req.params;

    const playerScores = leaderboard.get(playerId) || [];
    
    if (playerScores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pemain tidak ditemukan'
      });
    }

    const totalScore = playerScores.reduce((sum, score) => sum + score.score, 0);
    const avgAccuracy = Math.round(
      playerScores.reduce((sum, score) => sum + score.accuracy, 0) / playerScores.length
    );

    res.json({
      success: true,
      data: {
        playerId,
        totalScore,
        gamesPlayed: playerScores.length,
        avgAccuracy: `${avgAccuracy}%`,
        games: playerScores
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
 * Add score to leaderboard
 */
export const addScore = (req, res) => {
  try {
    const { playerId, gameId, score, accuracy } = req.body;

    if (!playerId || !gameId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak lengkap'
      });
    }

    if (!leaderboard.has(playerId)) {
      leaderboard.set(playerId, []);
    }

    leaderboard.get(playerId).push({
      gameId,
      score,
      accuracy,
      date: new Date()
    });

    res.json({
      success: true,
      message: 'Skor berhasil disimpan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getLeaderboard,
  getPlayerStats,
  addScore
};
