import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getUserProfile, updateUserProfile, getPlatformStats } from '../controllers/user.controller';

const router = Router();

router.get('/stats/platform', getPlatformStats);
router.use(authenticateToken);
router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);

export default router;
