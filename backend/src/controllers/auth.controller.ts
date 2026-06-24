/**
 * Authentication Controller
 * 
 * Handles user registration (signup) and login.
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User.model';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.util';

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
export const signup = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, password, role, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash,
      role: role || 'Donor',
      location,
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Return user data (exclude password_hash)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          photo_url: user.photo_url,
          isVerified: user.isVerified || false,
          verificationType: user.verificationType,
          phone: user.phone,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          photo_url: user.photo_url,
          isVerified: user.isVerified || false,
          verificationType: user.verificationType,
          phone: user.phone,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

