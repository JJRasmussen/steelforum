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
    const registerRes = await registerUser(
        'threadUser',
        'thread@a.com',
        'password',
        'password'
    );
    profile = await getProfileFromUserId(registerRes.body.user);
    const loginRes = await login('threadUser', 'password');
    jwtToken = loginRes.body.token;
});

afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
});

describe('post /thread happy path', () => {
    test('thread content validation', async () => {
        const happyThread = {
            title: 'New post Title',
            content: lorem,
            //tags to be implemented
            //when implemented add this:
            //['Tactician', 'Seize the Initiative']
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            happyThread.title,
            happyThread.content,
            happyThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Thread created');
        expect(res.body.thread.title).toBe(happyThread.title);
        expect(res.body.thread.content).toBe(happyThread.content);
        expect(res.body.thread.tags.map((tag) => tag.name)).toEqual(
            expect.arrayContaining(happyThread.tags)
        );
        expect(res.body.thread.author.id).toBe(profile.id);
        expect(res.body.thread).toHaveProperty('slug');
    });
});

// eslint-disable-next-line max-lines-per-function
describe('post /thread - invalid input', () => {
    test('No Title', async () => {
        const invalidThread = {
            title: '',
            content: lorem,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Title can not be empty',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Title too short', async () => {
        const invalidThread = {
            title: 'Hi',
            content: lorem,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Title is must exceed five characters',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Title too long', async () => {
        // eslint-disable-next-line no-magic-numbers
        const longTitle = 'a'.repeat(101);
        const invalidThread = {
            title: lorem,
            content: longTitle,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Title can not exceed 100 characters',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('No Content', async () => {
        const noContent = '';
        const invalidThread = {
            title: 'New Thread Title',
            content: noContent,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Content can not be empty',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Content too short', async () => {
        const shortContent = 'a'.repeat(2);
        const invalidThread = {
            title: 'New Thread Title',
            content: shortContent,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Content must exceed 25 characters',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Content too long', async () => {
        const longContent = 'a'.repeat(5001);
        const invalidThread = {
            title: 'New Thread Title',
            content: longContent,
            tags: [],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Content can not exceed 5000 characters',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Invalid tags', async () => {
        const invalidtag = 123456;
        const invalidThread = {
            title: 'New Thread Title',
            content: lorem,
            tags: [invalidtag],
        };
        const res = await postThread(
            jwtToken,
            invalidThread.title,
            invalidThread.content,
            invalidThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    description: 'Tag IDs are invalid',
                    type: 'badRequest',
                }),
            ])
        );
    });
    test('Unauthenticated user cannot post a thread', async () => {
        const validThread = {
            title: 'New post Title',
            content: lorem,
            //tags to be implemented
            //when implemented add this:
            //['Tactician', 'Seize the Initiative']
            tags: [],
        };
        const res = await postThread(
            null,
            validThread.title,
            validThread.content,
            validThread.tags
        );
        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
});
