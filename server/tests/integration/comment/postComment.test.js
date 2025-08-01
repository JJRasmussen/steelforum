import { describe, jest, test } from '@jest/globals';
import prisma from '../../../utils/prisma.js';
import StatusCodes from '../../../utils/statusCodes.js';
import { registerUser, login } from '../auth/authUtils.js';
import { postThread } from '../thread/threadUtils.js';
import { resetDatabase } from '../../testUtils.js';
import { postComment } from './commentUtils.js';

let jwtToken;
let threadResponse;
const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae fermentum felis, at feugiat nisi. Aenean massa justo, tincidunt vel mollis vel, sodales nec orci.';

const sampleThread = {
    title: 'New post Title',
    content: lorem,
    tagIDs: [],
};
beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
beforeAll(async () => {
    await resetDatabase();
    await registerUser(
        'threadUser',
        'thread@a.com',
        'password',
        'password'
    );
    const loginRes = await login('threadUser', 'password');
    jwtToken = loginRes.body.token;
    threadResponse = await postThread(
        jwtToken,
        sampleThread.title,
        sampleThread.content,
        sampleThread.tagIDs
    );
});
afterAll(async () => {
    await prisma.$disconnect();
});
describe('post /thread happy path', () => {
    test('thread content validation', async () => {
        const happyComment = {
            content: lorem,
            tagIDs: [],
            parentThreadID: threadResponse.body.thread.id,
            parentCommentID: null,
        };
        const res = await postComment(
            jwtToken,
            happyComment.content,
            happyComment.tagIDs,
            happyComment.parentThreadID,
            happyComment.parentCommentID
        );
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Comment created');
        expect(res.body.comment.content).toBe(happyComment.content);
        expect(res.body.comment.content).toBe(happyComment.content);
        expect(res.body.comment.tags.map((tag) => tag.id)).toEqual(
            expect.arrayContaining(happyComment.tagIDs)
        );
        expect(res.body.comment.author.id).toBe(
            threadResponse.body.thread.author.id
        );
    });
});
