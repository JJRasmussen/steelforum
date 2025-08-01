import prisma from '../../utils/prisma.js';
import { BadRequestError } from '../../errors/CustomErrors.js';

export async function addCommentToDatabase(
    profile,
    content,
    tagIDs,
    parentThreadID,
    parentCommentID
) {
    try {
        const comment = await prisma.comment.create({
            data: {
                content: content,
                thread: {
                    connect: { id: parentThreadID },
                },
                parentComment: parentCommentID
                    ? { connect: { id: parentCommentID } }
                    : undefined,

                author: {
                    connect: { id: profile.id },
                },
                tags: tagIDs?.length
                    ? { connect: tagIDs.map((tagId) => ({ id: tagId })) }
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
        return comment;
    } catch (err) {
        console.error('Error creating comment:', err);
        if (err instanceof prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2003') {
                throw new BadRequestError(
                    'Invalid profile, parentComment or tag reference'
                );
            }
        }
        throw new BadRequestError('Failed to create comment.');
    }
}

export default {
    addCommentToDatabase,
};
