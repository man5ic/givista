/**
 * Donation Verification Controller
 * 
 * Handles donation verification operations (approve/reject by Admin/NGO).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Donation from '../models/Donation.model';
import User from '../models/User.model';
import { sendDonationVerificationNotification } from '../utils/notification.util';

/**
 * GET /api/v1/donations/verification/pending
 * Get all unverified donations (Admin/NGO only)
 */
export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Only Admin or verified NGOs can view pending verifications
    const user = await User.findByPk(req.user.id);
    if (!user || (user.role !== 'Admin' && (!user.isVerified || user.role === 'Receiver'))) {
      return res.status(403).json({
        success: false,
        message: 'Admin or verified NGO access required',
      });
    }

    const donations = await Donation.findAll({
      where: {
        verificationStatus: 'Pending',
        isVerified: false,
      },
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'location', 'isVerified', 'verificationType'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: donations,
    });
  } catch (error: any) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending verifications',
    });
  }
};

/**
 * POST /api/v1/donations/verification/approve/:id
 * Approve a donation (Admin/NGO only)
 */
export const approveDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Only Admin or verified NGOs can approve
    const verifier = await User.findByPk(req.user.id);
    if (!verifier || (verifier.role !== 'Admin' && (!verifier.isVerified || verifier.role === 'Receiver'))) {
      return res.status(403).json({
        success: false,
        message: 'Admin or verified NGO access required',
      });
    }

    const donationId = parseInt(req.params.id);
    const { remarks } = req.body;

    const donation = await Donation.findByPk(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    if (donation.verificationStatus === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Donation is already approved',
      });
    }

    // Approve donation
    donation.isVerified = true;
    donation.verificationStatus = 'Approved';
    donation.verifiedBy = verifier.id;
    donation.verificationDate = new Date();
    donation.verificationRemarks = remarks || null;
    await donation.save();

    // Fetch donor for notification
    const donor = await User.findByPk(donation.donorId);
    if (donor) {
      await sendDonationVerificationNotification(
        donor.email,
        donor.name,
        donation.title,
        'approved',
        remarks
      );
    }

    res.json({
      success: true,
      message: 'Donation approved successfully',
      data: donation,
    });
  } catch (error: any) {
    console.error('Approve donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve donation',
    });
  }
};

/**
 * POST /api/v1/donations/verification/reject/:id
 * Reject a donation (Admin/NGO only)
 */
export const rejectDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Only Admin or verified NGOs can reject
    const verifier = await User.findByPk(req.user.id);
    if (!verifier || (verifier.role !== 'Admin' && (!verifier.isVerified || verifier.role === 'Receiver'))) {
      return res.status(403).json({
        success: false,
        message: 'Admin or verified NGO access required',
      });
    }

    const donationId = parseInt(req.params.id);
    const { remarks } = req.body;

    if (!remarks || remarks.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection remarks are required',
      });
    }

    const donation = await Donation.findByPk(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    if (donation.verificationStatus === 'Rejected') {
      return res.status(400).json({
        success: false,
        message: 'Donation is already rejected',
      });
    }

    // Reject donation
    donation.isVerified = false;
    donation.verificationStatus = 'Rejected';
    donation.verifiedBy = verifier.id;
    donation.verificationDate = new Date();
    donation.verificationRemarks = remarks;
    await donation.save();

    // Fetch donor for notification
    const donor = await User.findByPk(donation.donorId);
    if (donor) {
      await sendDonationVerificationNotification(
        donor.email,
        donor.name,
        donation.title,
        'rejected',
        remarks
      );
    }

    res.json({
      success: true,
      message: 'Donation rejected',
      data: donation,
    });
  } catch (error: any) {
    console.error('Reject donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject donation',
    });
  }
};

