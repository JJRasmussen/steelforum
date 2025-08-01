import threadQueries from '../thread/thread.queries.js';
import commentQueries from './comment.queries.js';

export async function createNewComment(
    user,
    content,
    tagIDs,
    parentThreadID,
    parentCommentID = null
) {
    const profile = await threadQueries.getProfileFromUserId(user);
    const comment = await commentQueries.addCommentToDatabase(
        profile,
        content,
        tagIDs,
        parentThreadID,
        parentCommentID
    );

    return comment;
}
/*
export async function getAllThreads() {
    const threads = await threadQueries.queryEveryThread();
    return threads;
}*/
