/**
 * Authentication Controller - with forgot/reset password
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User.model';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.util';
import { generateOTP, getOTPExpiration, isOTPExpired } from '../utils/otp.util';

// In-memory OTP store (production: use Redis)
const passwordResetOTPs = new Map<string, { otp: string; expiresAt: Date }>();

export const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const { name, email, password, role, location } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: 'User with this email already exists' });
    const password_hash = await hashPassword(password);
    const user = await User.create({ name, email, password_hash, role: role || 'Donor', location });
    const token = generateToken(user.id, user.email, user.role);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, photo_url: user.photo_url, isVerified: user.isVerified || false, verificationType: user.verificationType, phone: user.phone, badges: user.badges || [], points: user.points || 0, createdAt: user.createdAt }, token } });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Failed to register user', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = generateToken(user.id, user.email, user.role);
    res.json({ success: true, message: 'Login successful', data: { user: { id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, photo_url: user.photo_url, isVerified: user.isVerified || false, verificationType: user.verificationType, phone: user.phone, badges: user.badges || [], points: user.points || 0, createdAt: user.createdAt }, token } });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Failed to login', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const user = await User.findOne({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, message: 'If this email exists, a reset code has been sent' });
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();
    passwordResetOTPs.set(email, { otp, expiresAt });
    // In production: send real email. For dev, log to console.
    console.log(`\n🔑 PASSWORD RESET OTP for ${email}: ${otp} (expires ${expiresAt.toISOString()})\n`);
    res.json({ success: true, message: 'If this email exists, a reset code has been sent', ...(process.env.NODE_ENV === 'development' && { devOtp: otp }) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const stored = passwordResetOTPs.get(email);
    if (!stored) return res.status(400).json({ success: false, message: 'No reset request found. Please request a new code.' });
    if (isOTPExpired(stored.expiresAt)) {
      passwordResetOTPs.delete(email);
      return res.status(400).json({ success: false, message: 'Reset code has expired. Please request a new one.' });
    }
    if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid reset code' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.password_hash = await hashPassword(newPassword);
    await user.save();
    passwordResetOTPs.delete(email);
    res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
