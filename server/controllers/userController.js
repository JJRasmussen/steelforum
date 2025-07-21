import db from '../db/queries/userQueries.js';
import argon2 from 'argon2';

export async function createNewUser(req, res, next){
    console.log("pepper is:" + process.env.PASSWORD_PEPPER)
    try {
        const hashedPassword = await argon2.hash(req.body.password, {
            secret: Buffer.from(process.env.PASSWORD_PEPPER, 'utf-8')
        });
        await db.addNewUserToDatabase(
            hashedPassword,
            req.body.email,
            req.body.username,
        );
    } catch(err) {
        console.error("Error creating user:", err);
        next(err);
    };
};