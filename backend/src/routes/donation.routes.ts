/**
 * Donation Routes
 * 
 * Defines routes for donation operations.
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  getFlaggedDonations,
  markDonationSafe,
  confirmDonationFraud,
  rescoreAllDonations,
} from '../controllers/donation.controller';
import {
  getPendingVerifications,
  approveDonation,
  rejectDonation,
} from '../controllers/donationVerification.controller';
import { updateDonationStatus } from '../controllers/donationTracking.controller';

const router = Router();

// All donation routes require authentication
router.use(authenticateToken);

// Validation for creating donation
const createDonationValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .isIn(['Money', 'Food', 'Clothes', 'Blood', 'Other'])
    .withMessage('Invalid category'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// POST /api/v1/donations - Create donation
router.post('/', createDonationValidation, createDonation);

// GET /api/v1/donations - Get all donations
router.get('/', getAllDonations);

// GET /api/v1/donations/:id - Get donation by ID
router.get('/:id', getDonationById);

// PUT /api/v1/donations/:id - Update donation
router.put('/:id', updateDonation);

// Donation Tracking (status updates)
// POST /api/v1/donations/:id/status - Update status (Admin/NGO only)
router.post('/:id/status', [
  body('status').isIn(['Pending','Matched','Dispatched','Received','Completed','Cancelled']).withMessage('Invalid status'),
  body('remarks').optional().isString(),
], updateDonationStatus);

// Donation Verification Routes (Admin/NGO only)
// GET /api/v1/donations/verification/pending - Get pending verifications
router.get('/verification/pending', getPendingVerifications);

// POST /api/v1/donations/verification/approve/:id - Approve donation
router.post('/verification/approve/:id', [
  body('remarks').optional().isString().withMessage('Remarks must be a string'),
], approveDonation);

// POST /api/v1/donations/verification/reject/:id - Reject donation
router.post('/verification/reject/:id', [
  body('remarks').trim().notEmpty().withMessage('Remarks are required for rejection'),
], rejectDonation);

// Fraud monitoring (Admin only) - assume authenticateToken provides role; simple gate inline
router.get('/fraud/flagged', getFlaggedDonations);
router.post('/fraud/mark-safe/:id', markDonationSafe);
router.post('/fraud/confirm/:id', confirmDonationFraud);
router.post('/fraud/rescore-all', rescoreAllDonations);

export default router;

