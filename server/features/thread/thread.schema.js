import { body } from 'express-validator';

const newThreadSchema = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Title can not be empty')
        .isLength({ max: 100 })
        .withMessage('Title can not exceed 100 characters')
        .isLength({ min: 5 })
        .withMessage('Title is must exceed five characters')
        .bail(),
    body('content')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Content can not be empty')
        .isLength({ max: 5000 })
        .withMessage('Content can not exceed 5000 characters')
        .isLength({ min: 25 })
        .withMessage('Content must exceed 25 characters')
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
