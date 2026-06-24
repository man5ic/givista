/**
 * Verification Controller
 * 
 * Handles profile verification operations (OTP, KYC upload, admin approval).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Verification from '../models/Verification.model';
import { generateOTP, getOTPExpiration, isOTPExpired, sendEmailOTP, sendSMSOTP } from '../utils/otp.util';

/**
 * POST /api/v1/verification/send-otp
 * Send OTP for email or phone verification
 */
export const sendOTP = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { type, phone } = req.body; // type: 'email' or 'phone'

    if (!type || !['email', 'phone'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification type. Must be "email" or "phone"',
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    // Delete any existing pending OTPs for this user and type
    await Verification.destroy({
      where: {
        userId: user.id,
        type,
        status: 'pending',
      },
    });

    // Create new verification record
    const verification = await Verification.create({
      userId: user.id,
      type,
      otp,
      otpExpiresAt: expiresAt,
      status: 'pending',
    });

    // Send OTP
    if (type === 'email') {
      await sendEmailOTP(user.email, otp);
    } else if (type === 'phone') {
      const phoneNumber = phone || user.phone;
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required for phone verification',
        });
      }
      // Update user phone if provided
      if (phone && phone !== user.phone) {
        user.phone = phone;
        await user.save();
      }
      await sendSMSOTP(phoneNumber, otp);
    }

    res.json({
      success: true,
      message: `OTP sent to your ${type}`,
      data: {
        verificationId: verification.id,
        expiresAt: expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

/**
 * POST /api/v1/verification/verify-otp
 * Verify OTP code
 */
export const verifyOTP = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { otp, type } = req.body;

    if (!otp || !type) {
      return res.status(400).json({
        success: false,
        message: 'OTP and type are required',
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find pending verification
    const verification = await Verification.findOne({
      where: {
        userId: user.id,
        type,
        status: 'pending',
      },
      order: [['createdAt', 'DESC']],
    });

    if (!verification || !verification.otp) {
      return res.status(400).json({
        success: false,
        message: 'No pending verification found. Please request a new OTP.',
      });
    }

    // Check if expired
    if (verification.otpExpiresAt && isOTPExpired(verification.otpExpiresAt)) {
      await verification.destroy();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    if (verification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code',
      });
    }

    // Mark verification as verified
    verification.status = 'verified';
    await verification.save();

    // Update user verification status
    user.isVerified = true;
    user.verificationType = type;
    await user.save();

    res.json({
      success: true,
      message: 'Verification successful!',
      data: {
        isVerified: user.isVerified,
        verificationType: user.verificationType,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};

/**
 * POST /api/v1/verification/upload-kyc
 * Upload KYC document for ID verification
 */
export const uploadKYC = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const documentUrl = `/uploads/${req.file.filename}`;

    // Delete any existing pending ID verifications
    await Verification.destroy({
      where: {
        userId: user.id,
        type: 'id',
        status: 'pending',
      },
    });

    // Create verification record
    const verification = await Verification.create({
      userId: user.id,
      type: 'id',
      documentUrl,
      status: 'pending',
    });

    // Update user's KYC document URL (but don't mark as verified yet)
    user.kycDocument = documentUrl;
    await user.save();

    res.json({
      success: true,
      message: 'KYC document uploaded successfully. Waiting for admin approval.',
      data: {
        verificationId: verification.id,
        documentUrl,
      },
    });
  } catch (error: any) {
    console.error('Upload KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload KYC document',
    });
  }
};

/**
 * GET /api/v1/verification/status
 * Get current verification status
 */
export const getVerificationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        isVerified: user.isVerified || false,
        verificationType: user.verificationType,
        kycDocument: user.kycDocument,
      },
    });
  } catch (error: any) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status',
    });
  }
};

/**
 * GET /api/v1/verification/requests (Admin only)
 * Get all pending verification requests
 */
export const getVerificationRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const requests = await Verification.findAll({
      where: {
        type: 'id',
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error('Get verification requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification requests',
    });
  }
};

/**
 * POST /api/v1/verification/approve/:id (Admin only)
 * Approve a KYC verification request
 */
export const approveVerification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const verificationId = parseInt(req.params.id);
    const verification = await Verification.findByPk(verificationId);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Verification request is not pending',
      });
    }

    // Approve verification
    verification.status = 'approved';
    await verification.save();

    // Update user verification status
    const user = await User.findByPk(verification.userId);
    if (user) {
      user.isVerified = true;
      user.verificationType = 'id';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Verification approved successfully',
    });
  } catch (error: any) {
    console.error('Approve verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve verification',
    });
  }
};

/**
 * POST /api/v1/verification/reject/:id (Admin only)
 * Reject a KYC verification request
 */
export const rejectVerification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const verificationId = parseInt(req.params.id);
    const verification = await Verification.findByPk(verificationId);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Verification request is not pending',
      });
    }

    // Reject verification
    verification.status = 'rejected';
    await verification.save();

    res.json({
      success: true,
      message: 'Verification rejected',
    });
  } catch (error: any) {
    console.error('Reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject verification',
    });
  }
};

