import { Router } from 'express';
import {
    createNewThread,
    validateTagIds,
    getAllThreads,
} from './thread.controller.js';
import StatusCodes from '../../utils/statusCodes.js';
import newThreadSchema from './thread.schema.js';
import handleValidationErrors from '../../middleware/handleValidationErrors.js';
import passport from '../auth/auth.passport.js';

// mainrouter adds /api/thread as prefix
const threadRouter = Router();

threadRouter.post(
    '/',
    newThreadSchema,
    handleValidationErrors,
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            await validateTagIds(req.body.tagIDs);

            const newThread = await createNewThread(
                req.body.title,
                req.body.content,
                req.body.tagIDs,
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

threadRouter.get('/', async (req, res, next) => {
    try {
        const threads = await getAllThreads();
        res.status(StatusCodes.OK).json({
            message: 'Threads sent',
            threads: threads,
        });
    } catch (err) {
        return next(err);
    }
});

export default threadRouter;
