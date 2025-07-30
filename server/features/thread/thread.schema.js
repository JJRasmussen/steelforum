import { body } from 'express-validator';

const newThreadSchema = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Title can not be empty')
        .isLength({ max: 100 })
        .withMessage('Title can not exceed 100 characters')
        .bail(),
    body('content')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Email can not be empty')
        .isLength({ max: 5000 })
        .withMessage('Title can not exceed 5000 characters')
        .bail(),
    body('tags')
        .isArray()
        .withMessage('Tags must be an array'),
    body('tags.*')
        .trim()
        .escape()
        .isLength({ max: 50 })
        .withMessage('Tags can not exceed 50 characters'),
        // TODO: Validate that tag is present in the db
];

export default newThreadSchema;
