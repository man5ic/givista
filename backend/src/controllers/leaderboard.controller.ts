/**
 * Leaderboard Controller
 * 
 * Handles leaderboard operations for top donors.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Donation from '../models/Donation.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

/**
 * GET /api/v1/leaderboard
 * Get top donors by points or donations
 */
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    console.log('[Leaderboard Backend] Starting leaderboard fetch...');
    const { sortBy = 'points', limit = 50 } = req.query;
    const limitNum = parseInt(limit as string) || 50;

    console.log('[Leaderboard Backend] SortBy:', sortBy, 'Limit:', limitNum);

    // Get all donors first
    const allDonors = await User.findAll({
      where: {
        role: 'Donor',
      },
      attributes: ['id', 'name', 'email', 'photo_url', 'isVerified', 'badges', 'points', 'showEmail', 'allowLeaderboardVisibility'],
      raw: false,
    });

    console.log('[Leaderboard Backend] Found', allDonors.length, 'donors');

    // Calculate completed donations for each donor
    const leaderboardData = await Promise.all(
      allDonors.map(async (user: any) => {
        // Only include users who allow leaderboard visibility
        if (user.allowLeaderboardVisibility === false) {
          return null;
        }

        const completedDonations = await Donation.count({
          where: {
            donorId: user.id,
            status: 'Completed',
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.showEmail !== false ? user.email : undefined,
          photo_url: user.photo_url,
          isVerified: user.isVerified || false,
          badges: user.badges || [],
          points: user.points || 0,
          completedDonations: completedDonations,
        };
      })
    );

    // Filter out null entries (users who opted out)
    const filteredLeaderboardData = leaderboardData.filter((entry) => entry !== null);

    console.log('[Leaderboard Backend] Calculated donations for all donors');

    // Sort the leaderboard
    let leaderboard: typeof filteredLeaderboardData;
    if (sortBy === 'donations') {
      leaderboard = filteredLeaderboardData.sort((a, b) => {
        if (b.completedDonations !== a.completedDonations) {
          return b.completedDonations - a.completedDonations;
        }
        return (b.points || 0) - (a.points || 0);
      });
    } else {
      leaderboard = filteredLeaderboardData.sort((a, b) => (b.points || 0) - (a.points || 0));
    }

    // Apply limit
    const topDonors = leaderboard.slice(0, limitNum);

    console.log('[Leaderboard Backend] Returning', topDonors.length, 'donors');

    res.json({
      success: true,
      data: topDonors,
    });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

