"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.transferValidators = exports.transactionValidators = void 0;
const express_validator_1 = require("express-validator");
exports.transactionValidators = [
    (0, express_validator_1.body)('amount')
        .isFloat({ min: 0.01, max: 1000000 })
        .withMessage('Amount must be greater than 0'),
];
exports.transferValidators = [
    ...exports.transactionValidators,
    (0, express_validator_1.body)('destinationWalletId')
        .isUUID()
        .withMessage('Invalid destination wallet ID'),
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
