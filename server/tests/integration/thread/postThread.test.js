import { describe, jest, test } from '@jest/globals';
import prisma from '../../../utils/prisma.js';
import StatusCodes from '../../../utils/statusCodes.js';
import { registerUser, login } from '../auth/authUtils.js';
import { postThread } from './threadUtils.js';
import { resetDatabase } from '../../testUtils.js';
import { getProfileFromUserId } from '../../../features/thread/thread.queries.js';

let jwtToken;
let profile;
const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae fermentum felis, at feugiat nisi. Aenean massa justo, tincidunt vel mollis vel, sodales nec orci.';

beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
    const registerRes = await registerUser('threadUser', 'thread@a.com', 'password', 'password');
    profile = await getProfileFromUserId(registerRes.body.user);
    const loginRes = await login('threadUser', 'password');
    jwtToken = loginRes.body.token;
});

afterAll(async () => {
    await resetDatabase();
    prisma.$disconnect;
})

describe('/thread happy path', () => {
    const happyThread = {
        title: 'New post Title',
        content: lorem,
        //tags to be implemented
        //when implemented add this:
        //['Tactician', 'Seize the Initiative']
        tags: [],
    };
    test('thread content validation', async () => {
        const res = await postThread(
            jwtToken,
            happyThread.title,
            happyThread.content,
            happyThread.tags
        );      
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Thread created');
        //thread content validation
        expect(res.body.thread.title).toBe(happyThread.title);
        expect(res.body.thread.content).toBe(happyThread.content);
        expect(res.body.thread.tags.map((tag) => tag.name)).toEqual(
            expect.arrayContaining(happyThread.tags)
        );
        //thread author validation
        expect(res.body.thread.author.id).toBe(profile.id);
        //thread slug validation
        expect(res.body.thread).toHaveProperty('slug');
    });
});
