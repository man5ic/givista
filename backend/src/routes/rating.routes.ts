import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import Rating from '../models/Rating.model';
import Donation from '../models/Donation.model';
import User from '../models/User.model';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';

const router = Router();
router.use(authenticateToken);

// POST /api/v1/ratings - Receiver submits rating for a completed donation
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { donationId, rating, comment } = req.body;
    if (!donationId || !rating) return res.status(400).json({ success: false, message: 'donationId and rating are required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    if (donation.status !== 'Completed') return res.status(400).json({ success: false, message: 'Can only rate completed donations' });

    const existing = await Rating.findOne({ where: { donationId } });
    if (existing) return res.status(400).json({ success: false, message: 'This donation has already been rated' });

    const newRating = await Rating.create({ donationId, donorId: donation.donorId, receiverId: req.user!.id, rating, comment });

    // Update donor average rating on User model (if field exists)
    const allRatings = await Rating.findAll({ where: { donorId: donation.donorId } });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    await User.update({ averageRating: Math.round(avg * 10) / 10 } as any, { where: { id: donation.donorId } });

    res.status(201).json({ success: true, message: 'Rating submitted!', data: newRating });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// GET /api/v1/ratings/donor/:donorId - Get all ratings for a donor
router.get('/donor/:donorId', async (req: AuthRequest, res: Response) => {
  try {
    const ratings = await Rating.findAll({
      where: { donorId: parseInt(req.params.donorId) },
      include: [{ model: User, as: 'receiver', attributes: ['name', 'photo_url'] }],
      order: [['createdAt', 'DESC']],
    });
    const avg = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;
    res.json({ success: true, data: { ratings, averageRating: Math.round(avg * 10) / 10, totalRatings: ratings.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
  }
});

export default router;
