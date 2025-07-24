import StatusCodes from '../utils/statusCodes.js'

export class CustomError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, details = null){
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  };
};

export class BadRequestError extends CustomError {
  constructor(message, details = null){
    super(message, StatusCodes.BAD_REQUEST, details);
  };
};

export class ConflictError extends CustomError {
  constructor(message, details = null){
    super(message, StatusCodes.CONFLICT, details);
  };
};

export class NotFoundError extends CustomError {
  constructor(message, details = null) {
    super(message, StatusCodes.NOT_FOUND, details);
  };
};
