export class CustomError extends Error {
  constructor(message, statusCode = 500, details = null){
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message, details = null){
    super(message, 400, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message, details = null){
    super(message, 409, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message, details = null) {
    super(message, 404, details);
  };
};
