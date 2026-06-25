/**
 * Donor Analytics Controller
 * 
 * Handles analytics and statistics for individual donors.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Donation from '../models/Donation.model';
import Request from '../models/Request.model';
import Match from '../models/Match.model';
import { Op, Sequelize } from 'sequelize';

/**
 * GET /api/v1/donors/analytics
 * Get donation analytics for the authenticated donor
 */
export const getDonorAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const donorId = req.user.id;

    // Only Donors can access their analytics
    if (req.user.role !== 'Donor' && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can access donation analytics',
      });
    }

    // Total donations count
    const totalDonations = await Donation.count({
      where: { donorId },
    });

    // Total donation amount (sum of quantities for Money category, count for others)
    const moneyDonations = await Donation.findAll({
      where: {
        donorId,
        category: 'Money',
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalAmount'],
      ],
      raw: true,
    });

    const totalAmount = (moneyDonations[0] as any)?.totalAmount 
      ? parseFloat((moneyDonations[0] as any).totalAmount as string) 
      : 0;

    // Donations by category (top 5)
    const donationsByCategory = await Donation.findAll({
      where: { donorId },
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
      ],
      group: ['category'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
      limit: 5,
      raw: true,
    });

    // Monthly donation trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await Donation.findAll({
      where: {
        donorId,
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity'],
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true,
    });

    // Donations this month
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const donationsThisMonth = await Donation.count({
      where: {
        donorId,
        createdAt: {
          [Op.gte]: thisMonthStart,
        },
      },
    });

    // Completed donations count
    const completedDonations = await Donation.count({
      where: {
        donorId,
        status: 'Completed',
      },
    });

    // Calculate impact: Count of unique receivers helped through matches
    const matches = await Match.findAll({
      where: {
        donorId,
        status: 'Confirmed',
      },
      attributes: ['receiverId'],
      raw: true,
    });

    const uniqueReceiversHelped = new Set(matches.map((m: any) => m.receiverId)).size;

    // People helped this month (through completed donations)
    const completedThisMonth = await Donation.count({
      where: {
        donorId,
        status: 'Completed',
        completedAt: {
          [Op.gte]: thisMonthStart,
        },
      },
    });

    // Format data for frontend
    const formattedDonationsByCategory = donationsByCategory.map((item: any) => ({
      category: item.category,
      count: parseInt(item.count),
      totalQuantity: item.totalQuantity ? parseFloat(item.totalQuantity as string) : 0,
    }));

    const formattedMonthlyDonations: Array<{ month: string; count: number; totalQuantity: number }> = monthlyDonations.map((item: any) => ({
      month: item.month,
      count: parseInt(item.count),
      totalQuantity: item.totalQuantity ? parseFloat(item.totalQuantity as string) : 0,
    }));

    res.json({
      success: true,
      data: {
        summary: {
          totalDonations,
          totalAmount,
          completedDonations,
          donationsThisMonth,
          peopleHelped: uniqueReceiversHelped,
          peopleHelpedThisMonth: completedThisMonth,
        },
        topCategories: formattedDonationsByCategory,
        monthlyTrend: formattedMonthlyDonations,
      },
    });
  } catch (error: any) {
    console.error('Get donor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donor analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
