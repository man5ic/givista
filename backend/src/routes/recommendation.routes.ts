/**
 * Recommendation Routes
 * 
 * Defines routes for AI recommendations.
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getRecommendations } from '../controllers/recommendation.controller';

const router = Router();

// All recommendation routes require authentication
router.use(authenticateToken);

// GET /api/v1/recommendations - Get AI recommendations
router.get('/', getRecommendations);

export default router;

