import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const transactionValidators = [
  body('amount')
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be greater than 0'),
];

export const transferValidators = [
  ...transactionValidators,
  body('destinationWalletId')
    .isUUID()
    .withMessage('Invalid destination wallet ID'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};