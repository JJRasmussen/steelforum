import { body } from 'express-validator';
import userDb from './user.queries.js';

const newUserSchema = [
    body('username')
        .trim()
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
            const usernameLowerCase = value.toLowerCase();
            const profile = await userDb.getProfileFromUsernameLowerCase(usernameLowerCase);
            if (profile) {
                return Promise.reject('Username already in use')
            };
            return true;
        }),
    body('email')
        .trim()
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
            };
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password can not be empty')
        .isLength({ min: 6 })
        .withMessage('Password length must be at least six characters'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return Promise.reject('Passwords did not match'); 
            }
            return true;
        }),
];

export default newUserSchema;