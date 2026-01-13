import express from 'express';
import {
  startGameSession,
  submitAnswer,
  endGameSession,
  getSessionDetails,
  getCurrentQuestion,
  getActiveSessions
} from '../controllers/gameplayController.js';

const router = express.Router();

// Start new game session
router.post('/start', startGameSession);

// Submit answer
router.post('/:sessionId/answer', submitAnswer);

// End game session
router.post('/:sessionId/end', endGameSession);

// Get current question for a session
router.get('/:sessionId/question', getCurrentQuestion);

// Get session details
router.get('/:sessionId', getSessionDetails);

// Debug: list active sessions
router.get('/active', getActiveSessions);

export default router;
