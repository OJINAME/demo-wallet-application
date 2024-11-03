"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidators = exports.registerValidators = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidators = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('phone_number')
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];
exports.loginValidators = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
