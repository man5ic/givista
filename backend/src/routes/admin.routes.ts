/**
 * Admin Routes
 * 
 * Defines routes for admin operations.
 */

import { Router } from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';
import { getAdminStatistics } from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// GET /api/v1/admin/statistics - Get admin dashboard statistics
router.get('/statistics', getAdminStatistics);

export default router;

