"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTransactionError = exports.InsufficientFundsError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, status = 500, code) {
        super(message);
        this.message = message;
        this.status = status;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
class InsufficientFundsError extends ApplicationError {
    constructor(message = 'Insufficient funds') {
        super(message, 400, 'INSUFFICIENT_FUNDS');
    }
}
exports.InsufficientFundsError = InsufficientFundsError;
class InvalidTransactionError extends ApplicationError {
    constructor(message = 'Invalid transaction') {
        super(message, 400, 'INVALID_TRANSACTION');
    }
}
exports.InvalidTransactionError = InvalidTransactionError;
