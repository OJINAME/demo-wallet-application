export class ApplicationError extends Error {
    constructor(
      public message: string,
      public status: number = 500,
      public code?: string
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class InsufficientFundsError extends ApplicationError {
    constructor(message: string = 'Insufficient funds') {
      super(message, 400, 'INSUFFICIENT_FUNDS');
    }
  }
  
  export class InvalidTransactionError extends ApplicationError {
    constructor(message: string = 'Invalid transaction') {
      super(message, 400, 'INVALID_TRANSACTION');
    }
  }