/**
 * Authentication Utilities
 * 
 * Helper functions for password hashing and JWT token generation.
 */

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain text password with hashed password
 * 
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if passwords match
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token for authenticated user
 * 
 * @param userId - User ID
 * @param email - User email
 * @param role - User role
 * @returns JWT token string
 */
export const generateToken = (userId: number, email: string, role: string): string => {
  const payload = {
    id: userId,
    email,
    role,
  };

  const secret = (process.env.JWT_SECRET || 'fallback_secret') as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

