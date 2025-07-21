import pool from '../pool.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addNewUserToDatabase(password, email, username) {
    try {
        const user = await prisma.user.create({
            data: {
                hashedPassword: password,
                email: email,
                Profile: {
                    create: {
                        username: username,
                    },
                },
            },
        });
        return user;
    } catch (err) {
        console.log("Error creating user w. Prisma:", err);
        throw err;
    }
}

//get profile
export async function getProfileFromUsername(username){
    const profile = await prisma.profile.findUnique({
        where: {
            username: username
        },
    });
    return profile;
};
//get user
export async function getUserFromUserId(userId){
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });
    return user;
};

//get user and profile for passport
export async function getUserAndProfileFromId(id){
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            Profile: true
        },
    });
    return user;
};

export default {
    addNewUserToDatabase,
    getProfileFromUsername,
    getUserFromUserId,
    getUserAndProfileFromId
}