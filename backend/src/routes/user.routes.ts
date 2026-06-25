<<<<<<< HEAD
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getUserProfile, updateUserProfile, getPlatformStats } from '../controllers/user.controller';

const router = Router();

router.get('/stats/platform', getPlatformStats);
router.use(authenticateToken);
router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);

export default router;
=======
/**
 * User Routes
 * 
 * Defines routes for user profile operations.
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/v1/users/:id - Get user profile
router.get('/:id', getUserProfile);

// PUT /api/v1/users/:id - Update user profile
router.put('/:id', updateUserProfile);

export default router;

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
