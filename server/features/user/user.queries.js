import prisma from '../../db/prisma.js';
import { ConflictError, BadRequestError } from '../../errors/CustomErrors.js';

export async function addNewUserToDatabase(password, email, username) {
    try {
        const user = await prisma.user.create({
            data: {
                hashedPassword: password,
                email: email,
                Profile: {
                    create: {
                        username: username,
                        usernameLowerCase: username.toLowerCase()
                    },
                },
            },
        });
        return user;
    } catch (err) {
        console.error('Error creating user w. Prisma:', err);
        if(err instanceof prisma.PrismaClientKnownRequestError){
            if (err.code === 'P2002'){
                throw new ConflictError('Email or username already in use.')
            }
            throw new BadRequestError('Invalid data format when creating user')
        }
        throw err;
    }
}

//get profile
export async function getProfileFromUsernameLowerCase(usernameLowerCase){
    const profile = await prisma.profile.findUnique({
        where: {
            usernameLowerCase: usernameLowerCase
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

export async function getUserFromEmail(email){
    const user = await prisma.user.findUnique({
        where: {
            email: email
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
    getProfileFromUsernameLowerCase,
    getUserFromUserId,
    getUserFromEmail,
    getUserAndProfileFromId
}