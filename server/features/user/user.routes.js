import { Router } from 'express';
import { createNewUser } from './user.controller.js';
import newUserSchema from './user.schema.js';
import handleValidationErrors from '../../middleware/handleValidationErrors.js';
import StatusCodes from '../../utils/statusCodes.js'

const userRouter = Router();
// mainrouter add /user as prefix
userRouter.post('/signup', 
    newUserSchema, 
    handleValidationErrors, 
    async(req, res, next) => {
        try {
            await createNewUser(req, res, next);
            return res.status(StatusCodes.CREATED).json({ msg: 'UserCreated' });
        } catch (err) {
            return next(err);
        }
    }
);

export default userRouter;