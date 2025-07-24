import passport from 'passport';
import argon2 from 'argon2';
import { Strategy as LocalStrategy } from 'passport-local'
import db from '../../db/queries/user.js';

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try{
            const profile = await db.getProfileFromUsername(username);
            if (!profile) {
                return done(null, false, {message: 'Incorrect username'});
            }
            const relatedUser = await db.getUserFromUserId(profile.userId);
            const match = await argon2.verify(relatedUser.hashedPassword, password, {
                secret: Buffer.from(process.env.PASSWORD_PEPPER, 'utf-8')
            });
            if (!match) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, relatedUser);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserAndProfileFromId(id);
        console.log("user")
        console.log(user)
        done(null, user);
    } catch(err) {
        done(err);
    }
});

export default passport;