import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createNewUser, giveMemberStatus, removeMemberStatus } from '../controllers/userController.js';
import newUserSchema from '../middleware/userMiddleware/validatorSchemas.js';
import passport from '../middleware/userMiddleware/passport.js';

const indexRouter = Router();