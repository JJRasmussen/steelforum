import express from 'express';
import passport from './features/auth/auth.passport.js';
import mainRouter from './mainRouter.js';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}

console.log('ENV Loaded: ', process.env.NODE_ENV);

const app = express();

// initialize the passport object on every request
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', mainRouter);

//error handling
app.use(errorHandler);

export default app;

if (import.meta.main) {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
} else {
    console.log('App was initiated as module');
}
