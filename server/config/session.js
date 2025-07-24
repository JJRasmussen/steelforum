import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import pool from './db/pool.js';

const PgSessionStore = connectPgSimple(session);
export const sessionConfig = session({ 
    store: new PgSessionStore({
        pool: pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // eslint-disable-next-line no-magic-numbers
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } //30 days
})