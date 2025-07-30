import { Router } from 'express';
import authRouter from './features/auth/auth.routes.js';
import threadRouter from './features/thread/thread.routes.js';
const mainRouter = Router();

//Public Routes
mainRouter.get('/api/home', async (req, res) => {
    return res.json({
        loggedIn: false,
        message: 'Welcome stranger',
        trendingPosts: [],
    });
});

mainRouter.use('/api/auth', authRouter);
mainRouter.use('/api/thread', threadRouter);
export default mainRouter;