/**
 * Verification Routes
 * 
 * Defines routes for profile verification operations.
 */

import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  sendOTP,
  verifyOTP,
  uploadKYC,
  getVerificationStatus,
  getVerificationRequests,
  approveVerification,
  rejectVerification,
} from '../controllers/verification.controller';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'kyc-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
  },
});

// All verification routes require authentication
router.use(authenticateToken);

// POST /api/v1/verification/send-otp - Send OTP
router.post('/send-otp', [
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
], sendOTP);

// POST /api/v1/verification/verify-otp - Verify OTP
router.post('/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone'),
], verifyOTP);

// POST /api/v1/verification/upload-kyc - Upload KYC document
router.post('/upload-kyc', upload.single('document'), uploadKYC);

// GET /api/v1/verification/status - Get verification status
router.get('/status', getVerificationStatus);

// Admin routes
// GET /api/v1/verification/requests - Get all pending verification requests
router.get('/requests', getVerificationRequests);

// POST /api/v1/verification/approve/:id - Approve verification
router.post('/approve/:id', approveVerification);

// POST /api/v1/verification/reject/:id - Reject verification
router.post('/reject/:id', rejectVerification);

export default router;

