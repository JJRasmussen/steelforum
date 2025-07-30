import fs from 'fs';
import path from 'node:path';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import authQueries from './auth.queries.js';
import { UnauthorizedError } from '../../errors/CustomErrors.js';

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
        if (!user) {
            return done(new UnauthorizedError('User not found for provided token'), false);;
        } else {
            return done(null, user);
        }
    } catch (err) {
        return done(new UnauthorizedError('Token validation failed', err), false);
    }
});

passport.use(strategy);

export default passport;
