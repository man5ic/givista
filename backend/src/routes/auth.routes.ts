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

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
