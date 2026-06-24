/**
 * User Controller
 * 
 * Handles user profile operations.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';

/**
 * GET /api/v1/users/:id
 * Get user profile by ID
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Users can only view their own profile unless they're Admin
    if (req.user?.id !== userId && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

/**
 * PUT /api/v1/users/:id
 * Update user profile
 */
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Users can only update their own profile unless they're Admin
    if (req.user?.id !== userId && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    const { name, location, photo_url } = req.body;
    if (name) user.name = name;
    if (location) user.location = location;
    if (photo_url) user.photo_url = photo_url;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        photo_url: user.photo_url,
        isVerified: user.isVerified,
        verificationType: user.verificationType,
      },
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

