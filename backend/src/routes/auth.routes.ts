<<<<<<< HEAD
import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Donor', 'Receiver', 'Admin']).withMessage('Role must be Donor, Receiver, or Admin'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

=======
/**
 * Authentication Routes
 * 
 * Defines routes for user registration and login.
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/auth.controller';

const router = Router();

// Validation rules for signup
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['Donor', 'Receiver', 'Admin'])
    .withMessage('Role must be Donor, Receiver, or Admin'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

// Validation rules for login
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

<<<<<<< HEAD
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
=======
// POST /api/v1/auth/signup - Register new user
router.post('/signup', signupValidation, signup);

// POST /api/v1/auth/login - Login user
router.post('/login', loginValidation, login);

export default router;

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
