import { Router } from 'express';
import { createNewUser, authenticateUser, issueJWT } from './auth.controller.js';
import StatusCodes from '../../utils/statusCodes.js'
import newUserSchema from './auth.schema.js';
import handleValidationErrors from '../../middleware/handleValidationErrors.js';
import passport from './auth.passport.js'

// mainrouter adds /api/auth as prefix
const authRouter = Router();

authRouter.post('/register', 
    newUserSchema, 
    handleValidationErrors, 
    async(req, res, next) => {
        try {
            await createNewUser(req.body.password, req.body.email, req.body.username);
            return res.status(StatusCodes.CREATED).json({ message: 'User created' });
        } catch (err) {
            return next(err);
        }
    }
);

authRouter.post('/login', async (req, res, next) => {
    try{
        const profile = await authenticateUser(req.body.username, req.body.password)
        if(!profile){
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Username or password is invalid, please try again' });
        } else {
            const jwt = issueJWT(profile);
            return res.status(StatusCodes.OK).json({ message: 'Successful login', token: jwt.token, expiresIn: jwt.expires })
        }
        } catch (err) {
        return next(err);
    }
})

authRouter.get('/protected', 
    passport.authenticate('jwt', { session: false }),
    (req, res, _next) => {
        return res.status(StatusCodes.OK).json({ message: 'you are authorized' });
});
/*
authRouter.post('/login', (req, res, next) => {
    
    const user = {
        id: 1,
        username: 'jeppe',
        email: 'jeppe@juul.com'
    }
    jwt.sign({ user: user }, 'secretkey', { expiresIn: '600s'}, (err, token) => {
        res.json({
            token: token
        });
    });
});

const verifyToken = (req, res, next) => {
    const bearerHeader = req.header['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        return next();
    } else {
        return res.status(StatusCodes.FORBIDDEN)
        .json({ message: 'You are not logged in'})
    }
}   

authRouter.get('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(StatusCodes.FORBIDDEN)
            .json({ message: 'You are not logged in' })
        } else {
            res.json({ 
                message: 'protected route reached',
                authData: authData
            })
        }
    });
});
*/
export default authRouter;