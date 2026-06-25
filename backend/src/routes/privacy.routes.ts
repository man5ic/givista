/**
 * Privacy Routes
 * 
 * Defines routes for privacy settings operations.
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getPrivacySettings, updatePrivacySettings } from '../controllers/privacy.controller';

const router = Router();

// All privacy routes require authentication
router.use(authenticateToken);

// GET /api/v1/privacy/settings - Get privacy settings
router.get('/settings', getPrivacySettings);

// PUT /api/v1/privacy/settings - Update privacy settings
router.put('/settings', updatePrivacySettings);

export default router;

