import fs from 'fs';
import argon2 from 'argon2';
import jsonWebToken from 'jsonwebtoken';
import authQueries from './auth.queries.js';

const hashPassword = async (password) => {
    return await argon2.hash(password, {
        secret: Buffer.from(process.env.PASSWORD_PEPPER, 'utf8')
    });
}
const validatePassword = async (hashedPassword, password) => {
    return await argon2.verify(
        hashedPassword, 
        password, 
        { 
            secret: Buffer.from(process.env.PASSWORD_PEPPER, 'utf-8') 
        }
    );
}
export async function createNewUser(password, email, username){
    const hashedPassword = await hashPassword(password)
    const user = await authQueries.addNewUserToDatabase(
        hashedPassword,
        email,
        username,
    );
    return user;
};
export async function authenticateUser(username, password){
    const profileWithUser = await authQueries.getProfileAndUserFromUsername(username);
    if(!profileWithUser){
        return false
    }
    const isValid = await validatePassword(profileWithUser.user.hashedPassword, password)
    if (!isValid) {
        return false
    } else {
        return profileWithUser;
    };
};

const PRIV_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf8');

export function issueJWT(profile, expiresIn = '1d'){
    const payload = {
        
        sub: profile.user.id,
        role: profile.user.role,
        username: profile.username,
        // TODO: implement renown and avatars
        // renown: profile.renown,
        // avatarUrl: profile.avatarUrl,
        // eslint-disable-next-line no-magic-numbers
        iat: Math.floor(Date.now() / 1000) //JWT requires iat to be in seconds, not milliseconds
    };
    const signOptions = {
        expiresIn: expiresIn,
        algorithm: 'RS256',
    };
    const privateKey = {
        key: PRIV_KEY,
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE
    }

    const signedToken = jsonWebToken.sign(payload, privateKey, signOptions);
    return{
        token: 'Bearer ' + signedToken,
        expires: expiresIn
    };
};