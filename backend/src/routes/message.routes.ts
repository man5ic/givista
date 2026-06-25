/**
 * Message Routes
 * 
 * Defines routes for messaging operations.
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { sendMessage, getMessages } from '../controllers/message.controller';

const router = Router();

// All message routes require authentication
router.use(authenticateToken);

// Validation for sending message
const sendMessageValidation = [
  body('receiverId').isInt().withMessage('Valid receiver ID is required'),
  body('text').trim().notEmpty().withMessage('Message text is required'),
];

// POST /api/v1/messages - Send message
router.post('/', sendMessageValidation, sendMessage);

// GET /api/v1/messages - Get messages
router.get('/', getMessages);

export default router;

