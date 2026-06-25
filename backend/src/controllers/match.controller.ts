/**
 * Match Controller - Admin review for AI matches
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Match from '../models/Match.model';
import User from '../models/User.model';

export const getPendingMatches = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const matches = await Match.findAll({
      where: { status: 'Pending Approval' },
      include: [
        { model: User, as: 'donor', attributes: ['id', 'name', 'email', 'isVerified', 'location'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'isVerified', 'location'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: matches });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to get matches' });
  }
};

export const approveMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const id = parseInt(req.params.id);
    const match = await Match.findByPk(id);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
    match.status = 'Confirmed';
    await match.save();
    res.json({ success: true, message: 'Match approved', data: match });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to approve match' });
  }
};

export const rejectMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const id = parseInt(req.params.id);
    const match = await Match.findByPk(id);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
    match.status = 'Rejected';
    await match.save();
    res.json({ success: true, message: 'Match rejected', data: match });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to reject match' });
  }
};
