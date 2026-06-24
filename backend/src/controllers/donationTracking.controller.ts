/**
 * Donation Tracking Controller
 * 
 * Updates donation status through lifecycle stages and records timestamps.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Donation from '../models/Donation.model';
import User from '../models/User.model';
import { sendDonationStatusNotification } from '../utils/notification.util';
import { onDonationCompleted } from '../services/badge.service';

const VALID_STATUSES = ['Pending', 'Matched', 'Dispatched', 'Received', 'Completed', 'Cancelled'] as const;

type DonationStatus = typeof VALID_STATUSES[number];

function isValidStatus(status: string): status is DonationStatus {
  return (VALID_STATUSES as readonly string[]).includes(status);
}

/**
 * POST /api/v1/donations/:id/status
 * Body: { status: 'Matched' | 'Dispatched' | 'Received' | 'Completed' | 'Cancelled', remarks?: string }
 */
export const updateDonationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Only Admins or verified NGOs (here: any verified non-Receiver) can update
    const actor = await User.findByPk(req.user.id);
    if (!actor || (actor.role !== 'Admin' && (!actor.isVerified || actor.role === 'Receiver'))) {
      return res.status(403).json({ success: false, message: 'Admin or verified NGO access required' });
    }

    const donationId = parseInt(req.params.id);
    const { status, remarks } = req.body as { status?: string; remarks?: string };

    if (!status || !isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Ensure donation and donor are verified
    const donor = await User.findByPk(donation.donorId);
    if (!donation.isVerified || !donor?.isVerified) {
      return res.status(400).json({ success: false, message: 'Donation and donor must be verified' });
    }

    // Record timestamps by stage
    const now = new Date();
    switch (status) {
      case 'Matched':
        donation.matchedAt = now;
        break;
      case 'Dispatched':
        donation.dispatchedAt = now;
        break;
      case 'Received':
        donation.receivedAt = now;
        break;
      case 'Completed':
        donation.completedAt = now;
        break;
      case 'Cancelled':
        // no stage timestamp; keep as is
        break;
    }

    donation.status = status as DonationStatus;
    await donation.save();

    // Update badges and points when donation is completed
    if (status === 'Completed') {
      console.log(`[Badge Service] Donation ${donation.id} marked as Completed, triggering badge/point update...`);
      try {
        await onDonationCompleted(donation);
        console.log(`[Badge Service] Successfully updated badges/points for donation ${donation.id}`);
      } catch (error: any) {
        console.error('[Badge Service] Error updating badges/points:', error);
        console.error('[Badge Service] Error stack:', error.stack);
        // Don't fail the request if badge update fails
      }
    } else {
      console.log(`[Badge Service] Donation ${donation.id} status changed to ${status} (not Completed, skipping badge update)`);
    }

    // Notify donor (and optionally receiver later)
    await sendDonationStatusNotification(
      donor.email,
      donor.name,
      donation.title,
      status as DonationStatus,
      remarks || null
    );

    return res.json({ success: true, message: 'Donation status updated', data: donation });
  } catch (error: any) {
    console.error('Update donation status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update donation status' });
  }
};
