import path from 'node:path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from './controllers/db/pool.js';
import passport from './middleware/userMiddleware/passport.js';
import indexRouter from './routes/indexRouter.js';
import dotenv from 'dotenv';
import errorHandler from '../errors/errorHandler.js';

if (process.env.NODE_ENV === 'test'){
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
};


console.log('ENV Loaded: ', process.env.NODE_ENV);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup styles
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

//setup session
const PgSessionStore = connectPgSimple(session);
app.use(session({ 
    store: new PgSessionStore({
        pool: pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30*24*60*60*1000 } //30 days
}));
app.use(passport.session());


app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

//error handling
app.use(errorHandler);

export default app;

if (process.argv[1] === __filename){
    const PORT = 3000;
    app.listen(3000, () => console.log(`app listening on port ${3000}!`));
} else {
    console.log('App was initiated as module')
}