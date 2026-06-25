/**
 * Donor Routes
 * 
 * Defines routes for donor-specific operations.
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getDonorAnalytics } from '../controllers/donorAnalytics.controller';

const router = Router();

// All donor routes require authentication
router.use(authenticateToken);

// GET /api/v1/donors/analytics - Get donor analytics
router.get('/analytics', getDonorAnalytics);

export default router;

