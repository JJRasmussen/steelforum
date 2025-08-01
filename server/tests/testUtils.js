import prisma from '../utils/prisma.js';
import mainRouter from '../mainRouter.js';
import express from 'express';
import errorHandler from '../middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', mainRouter);
app.use(errorHandler);

async function resetDatabase() {
        await prisma.vote.deleteMany();    
        await prisma.comment.deleteMany();
        await prisma.thread.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();
};

async function createTestUser() {
    return await prisma.user.create({
        data: {
            email: 'test@example.com',
            password: 'hashedPassword',
            profile: {
                create: {
                    username: 'catlover123',
                },
            },
        },
        include: { profile: true },
    });
}

export { resetDatabase, createTestUser, app };
