import request from 'supertest';
import { app } from '../../testUtils.js';

export const postComment = async (
    jwtToken,
    content,
    tagIDs,
    parentThreadID,
    parentCommentID
) => {
    return await request(app)
        .post('/api/comment')
        .set('Authorization', jwtToken)
        .send({
            content: content,
            tagIDs: tagIDs,
            parentThreadID: parentThreadID,
            parentCommentID: parentCommentID,
        });
};
