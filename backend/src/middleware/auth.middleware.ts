/**
 * Authentication Middleware
 * 
 * This middleware verifies JWT tokens from request headers
 * and attaches the authenticated user to the request object.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * JWT Authentication Middleware
 * 
 * Usage: Add this middleware to routes that require authentication.
 * Example: router.get('/profile', authenticateToken, getUserProfile);
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
    }

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      id: number;
      email: string;
      role: string;
    };

    // Verify user still exists in database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Role-based Authorization Middleware
 * 
 * Usage: Add after authenticateToken to restrict routes by role.
 * Example: router.get('/admin', authenticateToken, authorizeAdmin, adminFunction);
 */
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Convenience middleware for specific roles
export const authorizeAdmin = authorizeRole('Admin');
export const authorizeDonor = authorizeRole('Donor');
export const authorizeReceiver = authorizeRole('Receiver');

