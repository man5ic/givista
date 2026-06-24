/**
 * Leaderboard Routes
 * 
 * Defines routes for leaderboard operations.
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getLeaderboard } from '../controllers/leaderboard.controller';

const router = Router();

// GET /api/v1/leaderboard - Get leaderboard (public, but requires auth for consistency)
router.get('/', authenticateToken, getLeaderboard);

export default router;

