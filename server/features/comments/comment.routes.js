import { Router } from 'express';
import StatusCodes from '../../utils/statusCodes.js';
import handleValidationErrors from '../../middleware/handleValidationErrors.js';
import newCommentSchema from './comment.schema.js';
import passport from '../auth/auth.passport.js';
import { validateTagIds } from '../thread/thread.controller.js';
import { createNewComment } from './comment.controller.js'

// mainrouter adds /api/comment as prefix
const commentRouter = Router();

commentRouter.post(
    '/',
    newCommentSchema,
    handleValidationErrors,
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            await validateTagIds(req.body.tagIDs);
            const { authorID, ...rest } = await createNewComment(
                req.user,
                req.body.content,
                req.body.tagIDs,
                req.body.parentThreadID,
                req.body.parentCommentID,
            );
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Comment created', comment: rest });
        } catch (err) {
            return next(err);
        }
    }
);
/*
threadRouter.post(
    '/',
    newThreadSchema,
    handleValidationErrors,
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            await validateTagIds(req.body.tags);

            const newThread = await createNewThread(
                req.body.title,
                req.body.content,
                req.body.tags,
                req.user
            );
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Thread created', thread: newThread });
        } catch (err) {
            return next(err);
        }
    }
);
*/
export default commentRouter;
