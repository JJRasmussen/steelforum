import prisma from '../utils/prisma.js';

async function resetDatabase() {
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
}

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

export default { resetDatabase, createTestUser };
