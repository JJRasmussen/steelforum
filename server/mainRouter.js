import { Router } from 'express';
import userRouter from './features/user/user.routes.js'

const mainRouter = Router();

//Public Routes
mainRouter.get('/', async(req, res) => {
    return res.json({
        name: 'frodo',
    });
});

mainRouter.get('/api/home', async(req, res) => {
    return res.json({
        loggedIn: false,
        message: 'Welcome stranger',
        trendingPosts: [],
    });
});

mainRouter.use('/user', userRouter);

export default mainRouter;


/*
indexRouter.get('/', async (req, res) => {
    let userCreated = (req.query.userCreation === 'true');
    let invalidLogin = (req.query.invalidLogin === 'true');
    res.render('index', { 
        user: req.user,
        userCreated: userCreated,
        invalidLogin: invalidLogin
    });
});

indexRouter.get('/sign-up', (req, res) => {
    res.render('sign-up', { user: req.user }
    )}
);
indexRouter.post('/sign-up', 
    newUserSchema,
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).render('sign-up', {
            errors: errors.array(),
            user: req.user
        });
    };
        createNewUser(req, res, next);
        res.redirect('/?userCreation=true');
    }
);

indexRouter.post('/log-in', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/?invalidLogin=true'
    })
);
*/