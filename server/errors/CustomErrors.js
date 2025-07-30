import StatusCodes from '../utils/statusCodes.js';

export class CustomError extends Error {
    constructor(
        message,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
        details = null,
        type = 'internal'
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.details = details;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends CustomError {
    constructor(message, details = null) {
        super(message, StatusCodes.BAD_REQUEST, details, 'badRequest');
    }
}

export class ConflictError extends CustomError {
    constructor(message, details = null) {
        super(message, StatusCodes.CONFLICT, details, 'conflictError');
    }
}

export class NotFoundError extends CustomError {
    constructor(message, details = null) {
        super(message, StatusCodes.NOT_FOUND, details, 'notFound');
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message, details = null) {
        super(message, StatusCodes.UNAUTHORIZED, details, 'unauthorized');
    }
}

export class ForbiddenError extends CustomError {
    constructor(message, details = null) {
        super(message, StatusCodes.FORBIDDEN, details, 'forbidden');
    }
}

export class InternalError extends CustomError {
    constructor(message, details = null){
        super(message, StatusCodes.INTERNAL_SERVER_ERROR, details, 'internal');
    }
}