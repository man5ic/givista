/**
 * Admin Controller
 * 
 * Handles admin dashboard statistics and analytics.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Donation from '../models/Donation.model';
import Request from '../models/Request.model';
import { Op, Sequelize } from 'sequelize';

/**
 * GET /api/v1/admin/statistics
 * Get comprehensive admin dashboard statistics (Admin only)
 */
export const getAdminStatistics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    // Total users
    const totalUsers = await User.count();

    // Verified vs unverified users
    const verifiedUsers = await User.count({ where: { isVerified: true } });
    const unverifiedUsers = totalUsers - verifiedUsers;

    // Users by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    // Total donations
    const totalDonations = await Donation.count();

    // Donations by status
    const donationsByStatus = await Donation.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Completed donations
    const completedDonations = await Donation.count({
      where: { status: 'Completed' },
    });

    // Pending donations
    const pendingDonations = await Donation.count({
      where: { status: 'Pending' },
    });

    // Total requests
    const totalRequests = await Request.count();

    // Requests by status
    const requestsByStatus = await Request.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Flagged donations (fraud detection)
    const flaggedDonations = await Donation.count({
      where: { isFlagged: true },
    });

    // Donations by category
    const donationsByCategory = await Donation.findAll({
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['category'],
      raw: true,
    });

    // Monthly growth - donations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyDonations = await Donation.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true,
    });

    // Monthly growth - users (last 6 months)
    const monthlyUsers = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
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
        createdAt: {
          [Op.gte]: thisMonthStart,
        },
      },
    });

    // Active NGOs (verified users with role Donor or Receiver)
    const activeNGOs = await User.count({
      where: {
        isVerified: true,
        role: {
          [Op.in]: ['Donor', 'Receiver'],
        },
      },
    });

    // Format data for frontend
    const formattedDonationsByCategory = donationsByCategory.map((item: any) => ({
      category: item.category,
      count: parseInt(item.count),
    }));

    const formattedMonthlyDonations = monthlyDonations.map((item: any) => ({
      month: item.month,
      donations: parseInt(item.count),
    }));

    const formattedMonthlyUsers = monthlyUsers.map((item: any) => ({
      month: item.month,
      users: parseInt(item.count),
    }));

    // Combine monthly data
    const monthlyGrowth: Array<{ month: string; donations: number; users: number }> = [];
    const allMonths = new Set([
      ...formattedMonthlyDonations.map((d: any) => d.month),
      ...formattedMonthlyUsers.map((u: any) => u.month),
    ]);

    allMonths.forEach((month) => {
      const donations = formattedMonthlyDonations.find((d: any) => d.month === month)?.donations || 0;
      const users = formattedMonthlyUsers.find((u: any) => u.month === month)?.users || 0;
      monthlyGrowth.push({ month, donations, users });
    });

    monthlyGrowth.sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          byRole: usersByRole.map((item: any) => ({
            role: item.role,
            count: parseInt(item.count),
          })),
        },
        donations: {
          total: totalDonations,
          completed: completedDonations,
          pending: pendingDonations,
          flagged: flaggedDonations,
          thisMonth: donationsThisMonth,
          byStatus: donationsByStatus.map((item: any) => ({
            status: item.status,
            count: parseInt(item.count),
          })),
          byCategory: formattedDonationsByCategory,
        },
        requests: {
          total: totalRequests,
          byStatus: requestsByStatus.map((item: any) => ({
            status: item.status,
            count: parseInt(item.count),
          })),
        },
        insights: {
          activeNGOs: activeNGOs,
          donationsThisMonth: donationsThisMonth,
        },
        charts: {
          monthlyGrowth: monthlyGrowth,
          donationsByCategory: formattedDonationsByCategory,
        },
      },
    });
  } catch (error: any) {
    console.error('Get admin statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

