/**
 * Recommendation Controller
 * 
 * Handles AI-powered recommendations for matching donors and receivers.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Request from '../models/Request.model';
import Recommendation from '../models/Recommendation.model';
import Match from '../models/Match.model';
import { getAIRecommendations, retryAICall } from '../services/ai.service';

// Helper: try to extract a numeric amount from free text (e.g., "need 4500 rupees")
function extractAmount(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.replace(/[,₹]/g, '').match(/\b(\d{2,})\b/);
  if (!match) return null;
  const val = parseInt(match[1], 10);
  return Number.isFinite(val) ? val : null;
}

// Helper: check if two amounts are close (±20%)
function amountsClose(a: number, b: number): boolean {
  const tol = Math.max(100, Math.round(0.2 * Math.max(a, b)));
  return Math.abs(a - b) <= tol;
}

/**
 * GET /api/v1/recommendations
 * Get AI recommendations for the current user
 */
export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    // Determine user type and get relevant context
    let userType: 'donor' | 'receiver';
    let category: string | undefined;
    let location: string | undefined;
    let urgency: 'Low' | 'Medium' | 'High' | undefined;

    if (userRole === 'Donor') {
      userType = 'donor';
      // Get donor's recent donations to understand preferences
      const recentDonation = await Donation.findOne({
        where: { donorId: userId },
        order: [['createdAt', 'DESC']],
      });
      if (recentDonation) {
        category = recentDonation.category;
      }
    } else if (userRole === 'Receiver') {
      userType = 'receiver';
      // Get receiver's open requests
      const openRequest = await Request.findOne({
        where: { receiverId: userId, status: 'Open' },
        order: [['createdAt', 'DESC']],
      });
      if (openRequest) {
        category = openRequest.category;
        urgency = openRequest.urgency;
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only Donors and Receivers can get recommendations',
      });
    }

    // Get user location
    const user = await User.findByPk(userId);
    if (user) {
      location = user.location;
    }

    // Call AI service with retry logic
    const aiResponse = await retryAICall(() =>
      getAIRecommendations({
        user_id: userId,
        user_type: userType,
        category,
        location,
        urgency,
      })
    );
    // Build a verified-only candidate set and fallback if AI returns empty
    const results: Array<{ userId: number; score: number; match_details: string }> = [];

    // Prefer AI results but filter to verified users only
    if (Array.isArray(aiResponse.recommendations)) {
      for (const rec of aiResponse.recommendations) {
        const targetUser = await User.findByPk(rec.user_id);
        if (targetUser?.isVerified) {
          results.push({ userId: rec.user_id, score: rec.score, match_details: rec.match_details });
        }
      }
    }

    // If AI returns nothing usable, do rule-based matching
    if (results.length === 0) {
      if (userType === 'donor') {
        // Find this donor's latest donation
        const donation = await Donation.findOne({ where: { donorId: userId, isVerified: true }, order: [['createdAt', 'DESC']] });
        const donorUser = await User.findByPk(userId);
        if (donation && donorUser?.isVerified) {
          // Candidate open requests from verified receivers, same category and same location
          const openRequests = await Request.findAll({ where: { status: 'Open', category: donation.category } });
          for (const req of openRequests) {
            const recv = await User.findByPk(req.receiverId);
            if (!recv?.isVerified) continue;
            const locOk = recv.location && donorUser.location && recv.location.toLowerCase().includes(donorUser.location.toLowerCase());
            if (!locOk) continue;
            // For Money category, try to match amounts closely
            let score = 0.7;
            let details = `Category and location match`;
            if (donation.category === 'Money') {
              const amount = donation.quantity;
              const want = extractAmount(`${req.title} ${req.description}`);
              if (want && amountsClose(amount, want)) { score = 0.95; details = `Amount ~${want}, location & category match`; } else { score = 0.75; details = `Location & category match`; }
            }
            results.push({ userId: req.receiverId, score, match_details: details });
          }
        }
      } else {
        // Receiver: find latest open request
        const openReq = await Request.findOne({ where: { receiverId: userId, status: 'Open' }, order: [['createdAt', 'DESC']] });
        const recvUser = await User.findByPk(userId);
        if (openReq && recvUser?.isVerified) {
          // Candidate verified donations with same category and similar location
          const donations = await Donation.findAll({ where: { isVerified: true, verificationStatus: 'Approved', category: openReq.category } });
          for (const d of donations) {
            const donor = await User.findByPk(d.donorId);
            if (!donor?.isVerified) continue;
            const locOk = donor.location && recvUser.location && donor.location.toLowerCase().includes(recvUser.location.toLowerCase());
            if (!locOk) continue;
            let score = 0.7;
            let details = `Category and location match`;
            if (d.category === 'Money') {
              const want = extractAmount(`${openReq.title} ${openReq.description}`);
              if (want && amountsClose(d.quantity, want)) { score = 0.95; details = `Amount ~${want}, location & category match`; }
            }
            results.push({ userId: d.donorId, score, match_details: details });
          }
        }
      }
    }

    // Persist recommendations and expand with user profiles
    const created: Recommendation[] = [] as any;
    for (const r of results) {
      if (userType === 'donor') {
        created.push(await Recommendation.create({ donorId: userId, receiverId: r.userId, score: r.score, match_details: r.match_details }));
        // Also create/update match entry (pending admin approval)
        await Match.findOrCreate({
          where: { donorId: userId, receiverId: r.userId },
          defaults: { donorId: userId, receiverId: r.userId, matchScore: r.score, status: 'Pending Approval' },
        });
      } else {
        created.push(await Recommendation.create({ donorId: r.userId, receiverId: userId, score: r.score, match_details: r.match_details }));
        await Match.findOrCreate({
          where: { donorId: r.userId, receiverId: userId },
          defaults: { donorId: r.userId, receiverId: userId, matchScore: r.score, status: 'Pending Approval' },
        });
      }
    }

    const withUsers = await Promise.all(
      created.map(async (rec) => {
        const targetUserId = userType === 'donor' ? rec.receiverId : rec.donorId;
        const targetUser = await User.findByPk(targetUserId, { attributes: { exclude: ['password_hash'] } });
        return { id: rec.id, score: rec.score, match_details: rec.match_details, user: targetUser, createdAt: rec.createdAt };
      })
    );

    res.json({ success: true, data: withUsers });
  } catch (error: any) {
    console.error('Get recommendations error:', error);

    // If AI service fails, return empty recommendations instead of error
    // This allows the app to continue working even if AI is down
    if (error.message.includes('AI service')) {
      return res.json({
        success: true,
        message: 'AI service unavailable, showing cached recommendations',
        data: [],
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

