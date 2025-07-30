import prisma from '../../utils/prisma.js';
import {
    CustomError,
    BadRequestError,
    NotFoundError,
    InternalError,
} from '../../errors/CustomErrors.js';

export async function getProfileFromUserId(user) {
    try {
        const profile = await prisma.profile.findUnique({
            where: {
                userId: user.id,
            },
        });
        if (!profile) {
            throw new NotFoundError(`Profile not found for user ID ${user.id}`);
        }
        return profile;
    } catch (err) {
        console.error('Error fetching profile:', err);
        throw new BadRequestError(
            `Failed to get profile from user ID ${user.id}`
        );
    }
}
export async function queryTagIds(tags) {
    try {
        const existingTags = await prisma.tag.findMany({
            where: {
                id: { in: tags },
            },
            select: { id: true },
        });
        const allExist = existingTags.length === tags.length;
        if (!allExist) {
            throw new BadRequestError('One or more tag IDs are invalid.', [
                {
                    description: 'Tag IDs are invalid',
                    param: 'tags',
                },
            ]);
        }
        return true;
    } catch (err) {
        console.error('Error validating tags:', err);

        if (err instanceof CustomError) {
            throw err;
        }

        throw new InternalError('Internal error validating tag IDs', [
            {
                description: 'Unexpected error validating tag IDs',
                param: 'tags',
            },
        ]);
    }
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
        console.error('Error creating thread:', err);
        if (err instanceof prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2003') {
                //foreign key constraint (profile or tag did not exist)
                throw new BadRequestError('Invalid profile or tag reference');
            }
        }
        throw new BadRequestError('failed to create thread.');
    }
}

export default {
    getProfileFromUserId,
    queryTagIds,
    addThreadToDatabase,
};
