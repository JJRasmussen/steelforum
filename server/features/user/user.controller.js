import db from './user.queries.js';
import argon2 from 'argon2';

export async function createNewUser(req, _res){
    const hashedPassword = await argon2.hash(req.body.password, {
        secret: Buffer.from(process.env.PASSWORD_PEPPER, 'utf-8')
    });
    await db.addNewUserToDatabase(
        hashedPassword,
        req.body.email,
        req.body.username,
    );
    return;
;
};