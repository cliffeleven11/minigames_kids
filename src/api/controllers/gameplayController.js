import { v4 as uuidv4 } from 'uuid';
import { GAMES_CONFIG, GAME_QUESTIONS } from '../../games/config/gamesConfig.js';
import generators from '../../games/generators.js';

/**
 * Gameplay Controller
 * Mengelola sesi permainan dan scoring
 */

// Temporary in-memory storage (gunakan database untuk production)
const gameSessions = new Map();
const playerScores = new Map();

/**
 * Mulai game session baru
 */
export const startGameSession = (req, res) => {
  try {
    const { gameId, playerId } = req.body;

    if (!gameId || !GAMES_CONFIG[gameId]) {
      return res.status(400).json({
        success: false,
        message: 'Game ID tidak valid'
      });
    }

    const sessionId = uuidv4();
    const gameConfig = GAMES_CONFIG[gameId];

    const session = {
      sessionId,
      gameId,
      playerId: playerId || 'anonymous',
      startTime: new Date(),
      score: 0,
      questions: [],
      currentQuestion: 0,
      answers: [],
      status: 'active'
    };

    // Generate questions server-side based on gameId
    try {
      if (gameId === 'counting_fruits') {
        session.questions = generators.generateCountingFruitsQuestions(gameConfig.questions);
      } else if (gameId === 'find_match_animals') {
        session.questions = [generators.generateFindMatchAnimalsQuestion()];
      } else if (gameId === 'maze_rabbit') {
        session.questions = [generators.generateMazeRabbitQuestion()];
      } else if (gameId === 'color_learn') {
        // pick from config questions if available
        session.questions = GAME_QUESTIONS && GAME_QUESTIONS.color_learn ? GAME_QUESTIONS.color_learn : generators.generateCountingFruitsQuestions(gameConfig.questions);
      } else if (gameId === 'shape_recognition') {
        session.questions = generators.generateShapeQuestions(gameConfig.questions);
      } else if (gameId === 'alphabet_quiz') {
        session.questions = generators.generateAlphabetQuestions(gameConfig.questions);
      } else if (gameId === 'memory_pairs') {
        session.questions = [generators.generateMemoryPairsQuestion(Math.max(4, Math.min(8, Math.floor(gameConfig.questions / 1))))];
      } else {
        // default: create placeholder questions
        session.questions = generators.generateCountingFruitsQuestions(gameConfig.questions);
      }
    } catch (genErr) {
      console.error('Question generation error:', genErr);
      session.questions = [];
    }

    gameSessions.set(sessionId, session);

    res.json({
      success: true,
      data: {
        sessionId,
        gameId,
        gameName: gameConfig.name,
        totalQuestions: session.questions.length || gameConfig.questions,
        totalDuration: gameConfig.duration,
        message: `Game "${gameConfig.name}" telah dimulai!`
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
 * Submit jawaban pemain
 */
export const submitAnswer = (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    const session = gameSessions.get(sessionId);
    if (!session) {
      console.warn('submitAnswer: session not found', { sessionId, knownSessions: Array.from(gameSessions.keys()).slice(0,20) });
      return res.status(404).json({
        success: false,
        message: 'Session tidak ditemukan'
      });
    }

    const gameConfig = GAMES_CONFIG[session.gameId];
    const isCorrect = validateAnswer(session.gameId, questionId, answer);

    // Calculate score based on time and correctness
    const points = isCorrect ? 
      calculatePoints(gameConfig.rewards.correct, timeSpent, gameConfig.duration) : 
      0;

    session.answers.push({
      questionId,
      answer,
      isCorrect,
      points,
      timeSpent,
      timestamp: new Date()
    });

    session.score += points;
    session.currentQuestion++;

    res.json({
      success: true,
      data: {
        isCorrect,
        points,
        totalScore: session.score,
        message: isCorrect ? '✅ Jawaban benar! Bagus sekali!' : '❌ Jawaban salah. Coba lagi!'
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
 * End game session dan save score
 */
export const endGameSession = (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = gameSessions.get(sessionId);
    if (!session) {
      console.warn('endGameSession: session not found', { sessionId, knownSessions: Array.from(gameSessions.keys()).slice(0,20) });
      return res.status(404).json({
        success: false,
        message: 'Session tidak ditemukan'
      });
    }

    // Calculate final stats
    const endTime = new Date();
    const duration = Math.floor((endTime - session.startTime) / 1000);
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const accuracy = session.answers.length > 0 ? 
      Math.round((correctAnswers / session.answers.length) * 100) : 0;

    const gameConfig = GAMES_CONFIG[session.gameId];
    const completionBonus = correctAnswers >= (session.answers.length * 0.7) ? 
      gameConfig.rewards.completion : 0;

    const finalScore = session.score + completionBonus;

    session.status = 'completed';
    session.endTime = endTime;
    session.duration = duration;
    session.accuracy = accuracy;
    session.finalScore = finalScore;

    // Save to leaderboard
    if (session.playerId !== 'anonymous') {
      if (!playerScores.has(session.playerId)) {
        playerScores.set(session.playerId, []);
      }
      playerScores.get(session.playerId).push({
        gameId: session.gameId,
        gameName: gameConfig.name,
        score: finalScore,
        accuracy,
        date: new Date()
      });
    }

    // Determine reward/badge
    const badge = calculateBadge(accuracy, correctAnswers, session.answers.length);

    res.json({
      success: true,
      data: {
        sessionId,
        gameName: gameConfig.name,
        finalScore,
        accuracy: `${accuracy}%`,
        correctAnswers,
        totalQuestions: session.answers.length,
        duration: `${duration} detik`,
        badge,
        completionBonus,
        message: `🎉 Selesai! Skormu: ${finalScore} poin`
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
 * Get session details
 */
export const getSessionDetails = (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = gameSessions.get(sessionId);
    if (!session) {
      console.warn('getSessionDetails: session not found', { sessionId, knownSessions: Array.from(gameSessions.keys()).slice(0,20) });
      return res.status(404).json({
        success: false,
        message: 'Session tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentQuestion = (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = gameSessions.get(sessionId);
    if (!session) {
      console.warn('getCurrentQuestion: session not found', { sessionId, knownSessions: Array.from(gameSessions.keys()).slice(0,20) });
      return res.status(404).json({ success: false, message: 'Session tidak ditemukan' });
    }

    const question = session.questions[session.currentQuestion] || null;

    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Debug: list active sessions
export const getActiveSessions = (req, res) => {
  try {
    const list = Array.from(gameSessions.values()).map(s => ({ sessionId: s.sessionId, gameId: s.gameId, playerId: s.playerId, status: s.status }));
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Helper Functions
 */

function validateAnswer(gameId, questionId, answer) {
  // Simplified validation - extend for actual questions
  return answer !== null && answer !== undefined;
}

function calculatePoints(basePoints, timeSpent, maxDuration) {
  // Faster answers get more points
  const timeBonus = Math.max(0, 1 - (timeSpent / maxDuration)) * basePoints * 0.5;
  return Math.round(basePoints + timeBonus);
}

function calculateBadge(accuracy, correctAnswers, totalQuestions) {
  if (accuracy === 100) return { emoji: '🏆', name: 'Sempurna!' };
  if (accuracy >= 80) return { emoji: '⭐', name: 'Hebat!' };
  if (accuracy >= 60) return { emoji: '👍', name: 'Bagus!' };
  return { emoji: '🌟', name: 'Coba Lagi!' };
}

export default {
  startGameSession,
  submitAnswer,
  endGameSession,
  getSessionDetails,
  getCurrentQuestion,
  getActiveSessions
};
