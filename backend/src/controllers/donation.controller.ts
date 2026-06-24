/**
 * Donation Controller
 * 
 * Handles donation CRUD operations.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Donation from '../models/Donation.model';
import User from '../models/User.model';
import { retryAICall, getAIRecommendations } from '../services/ai.service';
import Match from '../models/Match.model';
import Request from '../models/Request.model';
import { scoreDonationFraud, isFlaggedFromScore } from '../services/fraud.service';
import { onDonationCompleted } from '../services/badge.service';

/**
 * POST /api/v1/donations
 * Create a new donation
 */
export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, quantity, description, photo_url } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Only Donors can create donations
    if (req.user.role !== 'Donor' && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can create donations',
      });
    }

    // Check if user is verified (integrate with Profile Verification system)
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'You must verify your profile before creating donations. Please verify your profile first.',
      });
    }

    const donation = await Donation.create({
      donorId: req.user.id,
      title,
      category,
      quantity,
      description,
      photo_url,
      status: 'Pending',
      isVerified: false,
      verificationStatus: 'Pending',
    });

    // Run fraud scoring (fire-and-forget but awaited here to persist on create)
    try {
      const fraudScore = await scoreDonationFraud({ donorId: req.user.id, quantity });
      donation.fraudScore = fraudScore;
      donation.isFlagged = isFlaggedFromScore(fraudScore);
      await donation.save();
      console.log(`[Fraud Detection] Donation ${donation.id}: score=${fraudScore.toFixed(2)}, flagged=${donation.isFlagged}`);
    } catch (error: any) {
      console.error('[Fraud Detection] Error scoring donation:', error);
    }

    // Include donor info in response
    const donationWithDonor = await Donation.findByPk(donation.id, {
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'location'],
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donationWithDonor,
    });

    // Fire-and-forget: try generating matches for this donor (verified-only)
    (async () => {
      try {
        const donor = await User.findByPk(req.user!.id);
        if (!donor?.isVerified) return;
        // Use AI then fallback: here just use AI; recommendation endpoint will also cover manual refresh
        await retryAICall(() => getAIRecommendations({ user_id: donor.id, user_type: 'donor', category, location: donor.location }));
        // The recommendation endpoint persists matches; this call warms the AI but we also quickly rule-match open requests
        const openRequests = await Request.findAll({ where: { status: 'Open', category } });
        for (const r of openRequests) {
          const recv = await User.findByPk(r.receiverId);
          if (!recv?.isVerified) continue;
          const locOk = recv.location && donor.location && recv.location.toLowerCase().includes(donor.location.toLowerCase());
          if (!locOk) continue;
          await Match.findOrCreate({
            where: { donorId: donor.id, receiverId: r.receiverId },
            defaults: {
              donorId: donor.id,
              receiverId: r.receiverId,
              matchScore: 0.7,
              status: 'Pending Approval',
            },
          });
        }
      } catch {}
    })();
  } catch (error: any) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation',
    });
  }
};

/**
 * GET /api/v1/donations
 * Get all donations (with optional filters)
 */
export const getAllDonations = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status, donorId } = req.query;

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (donorId) where.donorId = parseInt(donorId as string);

    const donations = await Donation.findAll({
      where,
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'location', 'photo_url', 'isVerified', 'showEmail', 'showPhone', 'showLocation'],
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: donations,
    });
  } catch (error: any) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
    });
  }
};

/**
 * GET /api/v1/donations/:id
 * Get donation by ID
 */
export const getDonationById = async (req: AuthRequest, res: Response) => {
  try {
    const donationId = parseInt(req.params.id);

    const donation = await Donation.findByPk(donationId, {
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'name', 'email', 'location', 'photo_url', 'isVerified', 'showEmail', 'showPhone', 'showLocation'],
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error: any) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
    });
  }
};

/**
 * GET /api/v1/donations/fraud/flagged
 * List flagged donations
 */
export const getFlaggedDonations = async (req: AuthRequest, res: Response) => {
  try {
    const donations = await Donation.findAll({
      where: { isFlagged: true },
      include: [
        { model: User, as: 'donor', attributes: ['id','name','email','location'] },
      ],
      order: [['updatedAt','DESC']],
    });
    res.json({ success: true, data: donations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch flagged donations' });
  }
};

/**
 * POST /api/v1/donations/fraud/mark-safe/:id
 */
export const markDonationSafe = async (req: AuthRequest, res: Response) => {
  try {
    const donation = await Donation.findByPk(parseInt(req.params.id));
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    donation.isFlagged = false;
    donation.fraudScore = Math.min(donation.fraudScore || 0, 0.2);
    await donation.save();
    res.json({ success: true, message: 'Donation marked as verified safe', data: donation });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update donation' });
  }
};

/**
 * POST /api/v1/donations/fraud/confirm/:id
 */
export const confirmDonationFraud = async (req: AuthRequest, res: Response) => {
  try {
    const donation = await Donation.findByPk(parseInt(req.params.id));
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    donation.isFlagged = true;
    donation.fraudScore = Math.max(donation.fraudScore || 0.8, 0.8);
    donation.status = 'Cancelled';
    await donation.save();
    res.json({ success: true, message: 'Donation marked as confirmed fraud', data: donation });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update donation' });
  }
};

/**
 * POST /api/v1/donations/fraud/rescore-all
 * Retroactively score all donations (Admin only - useful for testing)
 */
export const rescoreAllDonations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const donations = await Donation.findAll();
    let rescored = 0;
    let flagged = 0;

    for (const donation of donations) {
      try {
        const fraudScore = await scoreDonationFraud({ donorId: donation.donorId, quantity: donation.quantity });
        donation.fraudScore = fraudScore;
        donation.isFlagged = isFlaggedFromScore(fraudScore);
        await donation.save();
        rescored++;
        if (donation.isFlagged) flagged++;
      } catch (error: any) {
        console.error(`Failed to rescore donation ${donation.id}:`, error);
      }
    }

    res.json({
      success: true,
      message: `Rescored ${rescored} donations, ${flagged} flagged`,
      data: { rescored, flagged },
    });
  } catch (error: any) {
    console.error('Rescore all error:', error);
    res.status(500).json({ success: false, message: 'Failed to rescore donations' });
  }
};

/**
 * PUT /api/v1/donations/:id
 * Update donation
 */
export const updateDonation = async (req: AuthRequest, res: Response) => {
  try {
    const donationId = parseInt(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Only the owner or Admin can update
    if (donation.donorId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update allowed fields
    const { title, category, quantity, description, status, photo_url } = req.body;
    if (title) donation.title = title;
    if (category) donation.category = category;
    if (quantity) donation.quantity = quantity;
    if (description) donation.description = description;
    if (status) donation.status = status;
    if (photo_url) donation.photo_url = photo_url;

    // Re-evaluate fraud if quantity or category changed (simple trigger)
    try {
      if (quantity || category) {
        const fraudScore = await scoreDonationFraud({ donorId: donation.donorId, quantity: donation.quantity });
        donation.fraudScore = fraudScore;
        donation.isFlagged = isFlaggedFromScore(fraudScore);
      }
    } catch {}

    // Check if status is being changed to Completed
    const wasCompleted = donation.status === 'Completed';
    const isNowCompleted = status === 'Completed' && donation.status !== 'Completed';
    
    await donation.save();

    // Update badges and points if status changed to Completed
    if (isNowCompleted) {
      console.log(`[Badge Service] Donation ${donation.id} status changed to Completed via PUT endpoint, triggering badge/point update...`);
      try {
        // Reload donation to get latest data
        const updatedDonation = await Donation.findByPk(donation.id);
        if (updatedDonation) {
          await onDonationCompleted(updatedDonation);
          console.log(`[Badge Service] Successfully updated badges/points for donation ${donation.id}`);
        }
      } catch (error: any) {
        console.error('[Badge Service] Error updating badges/points:', error);
        console.error('[Badge Service] Error stack:', error.stack);
      }
    }

    res.json({
      success: true,
      message: 'Donation updated successfully',
      data: donation,
    });
  } catch (error: any) {
    console.error('Update donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update donation',
    });
  }
};

