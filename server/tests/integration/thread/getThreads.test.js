import { describe, jest, test } from '@jest/globals';
import prisma from '../../../utils/prisma.js';
import StatusCodes from '../../../utils/statusCodes.js';
import { registerUser, login } from '../auth/authUtils.js';
import { postThread, getThreads } from './threadUtils.js';
import { resetDatabase } from '../../testUtils.js';

let jwtToken;

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
});

afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
});

describe('get /api/threads', () => {
    test('get thread - Happy path', async () => {
        await postThread(
            jwtToken,
            'Title of first thread',
            'This is the first thread and its content',
            []
        );
        await postThread(
            jwtToken,
            'This is the second thread',
            'Here is the second thread and its content',
            []
        );
        const res = await getThreads();
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Threads sent');
        expect(Array.isArray(res.body.threads)).toBe(true);
        // eslint-disable-next-line no-magic-numbers
        expect(res.body.threads).toHaveLength(2);
        const titles = res.body.threads.map((thread) => thread.title);
        expect(titles).toEqual(
            expect.arrayContaining([
                'Title of first thread',
                'This is the second thread',
            ])
        );
    });
});
