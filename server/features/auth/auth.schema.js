import { body } from 'express-validator';
import userDb from './auth.queries.js';

const newUserSchema = [
    body('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Username can not be empty')
        .bail()
        .isLength({ max: 22 })
        .withMessage('Username is too long')
        .bail()
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers')
        .bail()
        .custom(async (value) => {
            const profile = await userDb.getProfileAndUserFromUsername(value);
            if (profile) {
                return Promise.reject('Username already in use');
            } else {
                return true;
            }
        }),
    body('email')
        .trim()
        .escape()
        .toLowerCase()
        .notEmpty()
        .withMessage('Email can not be empty')
        .bail()
        .isEmail()
        .withMessage('Invalid email')
        .bail()
        .custom(async (value) => {
            const profile = await userDb.getUserFromEmail(value.toLowerCase());
            if (profile) {
                return Promise.reject('Email already in use');
            } else {
                return true;
            }
        }),
    body('password')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Password can not be empty')
        .bail.isLength({ min: 6 })
        .withMessage('Password length must be at least six characters'),
    body('passwordConfirmation')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return Promise.reject('Passwords did not match');
            } else {
                return true;
            }
        }),
];

const loginSchema = [
    body('username').trim().escape().notEmpty(),
    body('password').trim().escape().notEmpty(),
];

export default { newUserSchema, loginSchema };
