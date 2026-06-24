/**
 * Request Controller
 * 
 * Handles request CRUD operations.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Request from '../models/Request.model';
import User from '../models/User.model';
import { retryAICall, getAIRecommendations } from '../services/ai.service';
import Donation from '../models/Donation.model';
import Match from '../models/Match.model';

/**
 * POST /api/v1/requests
 * Create a new request
 */
export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, urgency } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Only Receivers can create requests
    if (req.user.role !== 'Receiver' && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only receivers can create requests',
      });
    }

    const request = await Request.create({
      receiverId: req.user.id,
      title,
      description,
      category,
      urgency: urgency || 'Medium',
      status: 'Open',
    });

    // Include receiver info in response
    const requestWithReceiver = await Request.findByPk(request.id, {
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'location'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: requestWithReceiver,
    });

    // Fire-and-forget: try generating matches for this receiver (verified-only)
    (async () => {
      try {
        const recv = await User.findByPk(req.user!.id);
        if (!recv?.isVerified) return;
        await retryAICall(() => getAIRecommendations({ user_id: recv.id, user_type: 'receiver', category, location: recv.location }));
        const donations = await Donation.findAll({ where: { category, isVerified: true, verificationStatus: 'Approved' } });
        for (const d of donations) {
          const donor = await User.findByPk(d.donorId);
          if (!donor?.isVerified) continue;
          const locOk = donor.location && recv.location && donor.location.toLowerCase().includes(recv.location.toLowerCase());
          if (!locOk) continue;
          await Match.findOrCreate({
            where: { donorId: d.donorId, receiverId: recv.id },
            defaults: {
              donorId: d.donorId,
              receiverId: recv.id,
              matchScore: 0.7,
              status: 'Pending Approval',
            },
          });
        }
      } catch {}
    })();
  } catch (error: any) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
    });
  }
};

/**
 * GET /api/v1/requests
 * Get all requests (with optional filters)
 */
export const getAllRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status, urgency, receiverId } = req.query;

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (receiverId) where.receiverId = parseInt(receiverId as string);

    const requests = await Request.findAll({
      where,
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'location', 'photo_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
    });
  }
};

/**
 * GET /api/v1/requests/:id
 * Get request by ID
 */
export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    const request = await Request.findByPk(requestId, {
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'location', 'photo_url'],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
    });
  }
};

/**
 * PUT /api/v1/requests/:id
 * Update request
 */
export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const request = await Request.findByPk(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Only the owner or Admin can update
    if (request.receiverId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update allowed fields
    const { title, description, category, urgency, status } = req.body;
    if (title) request.title = title;
    if (description) request.description = description;
    if (category) request.category = category;
    if (urgency) request.urgency = urgency;
    if (status) request.status = status;

    await request.save();

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request,
    });
  } catch (error: any) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request',
    });
  }
};

