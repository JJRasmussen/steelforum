import { body } from 'express-validator';
import { MAX_COMMENT_LENGTH } from './comment.constants';

const newThreadSchema = [
    body('content')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Comment can not be empty')
        .isLength({ max: MAX_COMMENT_LENGTH })
        .withMessage(`Comment can not exceed ${MAX_COMMENT_LENGTH} characters`),
    body('tagIDs').isArray().withMessage('Tags must be an array'),
    body('tagIDs.*')
        .trim()
        .escape()
        .isLength({ max: 50 })
        .withMessage('Tags can not exceed 50 characters'),
    // TODO: Validate that tag is present in the db
];

export default newThreadSchema;
