/**
 * Request Routes
 * 
 * Defines routes for request operations.
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
} from '../controllers/request.controller';

const router = Router();

// All request routes require authentication
router.use(authenticateToken);

// Validation for creating request
const createRequestValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['Money', 'Food', 'Clothes', 'Blood', 'Other'])
    .withMessage('Invalid category'),
  body('urgency')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid urgency level'),
];

// POST /api/v1/requests - Create request
router.post('/', createRequestValidation, createRequest);

// GET /api/v1/requests - Get all requests
router.get('/', getAllRequests);

// GET /api/v1/requests/:id - Get request by ID
router.get('/:id', getRequestById);

// PUT /api/v1/requests/:id - Update request
router.put('/:id', updateRequest);

export default router;

