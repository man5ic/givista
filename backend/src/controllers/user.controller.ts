/**
 * User Controller - with profile update, stats, and rating endpoints
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Request from '../models/Request.model';
import { Op } from 'sequelize';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.user?.id !== userId && req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (req.user?.id !== userId && req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, location, photo_url, phone } = req.body;
    if (name) user.name = name;
    if (location) user.location = location;
    if (photo_url !== undefined) user.photo_url = photo_url;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, photo_url: user.photo_url, phone: user.phone, isVerified: user.isVerified, verificationType: user.verificationType, badges: user.badges, points: user.points } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalDonations = await Donation.count({ where: { status: 'Completed' } });
    const totalDonors = await User.count({ where: { role: 'Donor' } });
    const totalReceivers = await User.count({ where: { role: 'Receiver' } });
    const totalRequests = await Request.count();
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
    const donationsThisMonth = await Donation.count({ where: { status: 'Completed', createdAt: { [Op.gte]: thisMonth } } });
    res.json({ success: true, data: { totalDonations, totalDonors, totalReceivers, totalRequests, donationsThisMonth, peopleHelped: totalReceivers } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats' });
  }
};
