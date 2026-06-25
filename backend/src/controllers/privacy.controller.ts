/**
 * Privacy Settings Controller
 * 
 * Handles user privacy settings operations.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';

/**
 * GET /api/v1/privacy/settings
 * Get current user's privacy settings
 */
export const getPrivacySettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'showEmail', 'showPhone', 'showLocation', 'allowLeaderboardVisibility'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        showEmail: user.showEmail ?? true,
        showPhone: user.showPhone ?? true,
        showLocation: user.showLocation ?? true,
        allowLeaderboardVisibility: user.allowLeaderboardVisibility ?? true,
      },
    });
  } catch (error: any) {
    console.error('Get privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch privacy settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * PUT /api/v1/privacy/settings
 * Update current user's privacy settings
 */
export const updatePrivacySettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { showEmail, showPhone, showLocation, allowLeaderboardVisibility } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update only provided fields
    if (typeof showEmail === 'boolean') {
      user.showEmail = showEmail;
    }
    if (typeof showPhone === 'boolean') {
      user.showPhone = showPhone;
    }
    if (typeof showLocation === 'boolean') {
      user.showLocation = showLocation;
    }
    if (typeof allowLeaderboardVisibility === 'boolean') {
      user.allowLeaderboardVisibility = allowLeaderboardVisibility;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: {
        showEmail: user.showEmail,
        showPhone: user.showPhone,
        showLocation: user.showLocation,
        allowLeaderboardVisibility: user.allowLeaderboardVisibility,
      },
    });
  } catch (error: any) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

