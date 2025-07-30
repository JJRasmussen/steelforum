import prisma from '../../utils/prisma.js';
import { ConflictError, BadRequestError } from '../../errors/CustomErrors.js';

export async function getProfileFromUserId(user) {
    try {
        return await prisma.profile.findUnique({
            where: {
                userId: user.id,
            },
        });
    } catch (err) {
        return err;
    }
}
export async function queryTagIds(tags) {
    const existingTags = await prisma.tag.findMany({
        where: {
            id: { in: tags },
        },
        select: { id: true },
    });
    return existingTags.length === tags.length;
}

export async function addThreadToDatabase(
    title,
    content,
    tagIds,
    profile,
    slug
) {
    try {
        const thread = await prisma.thread.create({
            data: {
                title: title,
                slug: slug,
                content: content,
                author: {
                    connect: { id: profile.id },
                },
                tagIds: tagIds?.length
                    ? { connect: tagIds.map((tagId) => ({ id: tagId })) }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true,
                    },
                },
                tags: true,
            },
        });
        return thread;
    } catch (err) {
        return err;
    }
}

export default {
    getProfileFromUserId,
    queryTagIds,
    addThreadToDatabase,
};