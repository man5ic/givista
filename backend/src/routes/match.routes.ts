/**
 * Match Routes
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getPendingMatches, approveMatch, rejectMatch } from '../controllers/match.controller';

const router = Router();

router.use(authenticateToken);

// Admin only endpoints
router.get('/pending', getPendingMatches);
router.post('/approve/:id', approveMatch);
router.post('/reject/:id', rejectMatch);

export default router;
