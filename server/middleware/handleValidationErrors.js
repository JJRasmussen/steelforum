import { validationResult } from 'express-validator';
import { BadRequestError, ConflictError } from '../errors/CustomErrors.js';

export default function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()){
        return next();

    }
    const formattedErrors = errors.array().map(err => (
        {
        message: err.msg,
        param: err.path,
        type: err.msg.includes('already in use') ? 'conflict' : 'badRequest',
    }));

    const hasConflict = formattedErrors.some(e => e.type === 'conflict');
    if (hasConflict) {
        return next(new ConflictError('Conflict error(s)', formattedErrors));
    }
    return next(new BadRequestError('Invalid input', formattedErrors));
};