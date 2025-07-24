import path from 'node:path';
import { fileURLToPath } from 'url';
import express from 'express';
import sessionConfig from './config/session.js';
import passport from './middleware/auth/passport.js';
import indexRouter from './mainRouter.js';
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
app.use(sessionConfig);
app.use(passport.session());


app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

//error handling
app.use(errorHandler);

export default app;

if (process.argv[1] === __filename){
    const PORT = 3000;
    app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
} else {
    console.log('App was initiated as module')
}