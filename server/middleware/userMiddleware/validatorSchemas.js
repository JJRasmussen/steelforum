import { body } from 'express-validator';
import userDb from '../../db/queries/userQueries.js';

const newUserSchema = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username can not be empty.')
        .bail()
        .isLength({ max: 22 })
        .withMessage('Username cannot be longer than 22 characters')
        .bail()
        .custom(async value => {
            try{
                console.log("howdy from validator")
                const user = await userDb.getProfileFromUsername(value);
                if (user) {
                    return false;
                }
            return true;
            } catch(error){
                console.error('error in validatorscheme', error);
                throw error
            };
            
        })
        .withMessage('Username is already in use'),
    body('password')
        .notEmpty()
        .withMessage('Password can not be empty')
        .isLength({ min: 6 })
        .withMessage('Password length must be at least six characters'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false;
            }
            return true;
        })
        .withMessage('The passwords did not match'),
];

export default newUserSchema;