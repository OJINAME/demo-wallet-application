import { body } from 'express-validator';

export const registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone_number')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

export const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
