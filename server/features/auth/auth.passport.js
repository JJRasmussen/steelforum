import fs from 'fs';
import path from 'node:path';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import authQueries from './auth.queries.js';

const __dirname = import.meta.dirname;
const pathToKey = path.join(__dirname, '/auth.utils/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await authQueries.getUserFromUserId(payload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
});

passport.use(strategy);

export default passport;
