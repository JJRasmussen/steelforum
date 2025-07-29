import { jest } from '@jest/globals';
import userQueries from '../../../features/auth/auth.queries.js';
import testUtils from '../../testUtils.js';
import StatusCodes from '../../../utils/statusCodes.js';
import { registerUser } from './authUtils.js';

beforeEach(async () => {
    await testUtils.resetDatabase();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('/register', () => {
    test('happy path /user/signup', async () => {
        const res = await registerUser(
            'Test',
            'a@a.com',
            'password',
            'password'
        );
        expect(res.body.message).toBe('User created');
        expect(res.statusCode).toBe(StatusCodes.CREATED);

        const profile = await userQueries.getProfileAndUserFromUsername(
            'Test'.toLowerCase()
        );
        expect(profile).toBeDefined();
        expect(profile.usernameLowerCase).toBe('test');
        expect(profile.userId).toBeDefined();
    });
});
describe('/auth/register - username validation', () => {
    test('signup fails when username is empty', async () => {
        const res = await registerUser('', 'a@a.com', 'password', 'password');
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    message: 'Username can not be empty',
                }),
            ])
        );
    });
    test('signup fails when username is too long', async () => {
        const res = await registerUser(
            '123456789123456789123456789',
            'b@b.com',
            'password',
            'password'
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Username is too long' }),
            ])
        );
    });
    test('signup fails when username contains non-alphanumeric values', async () => {
        const res = await registerUser(
            'testUser!:-)',
            'c@c.com',
            'password',
            'password'
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    message: 'Username must only contain letters and numbers',
                }),
            ])
        );
    });
    test('signup fails when username is taken', async () => {
        //trying to create the user from the happy path again
        await registerUser(
            'testUserDuplicate',
            'd@d.com',
            'password',
            'password'
        );
        const res = await registerUser(
            'testUserDuplicate',
            'e@e.com',
            'password',
            'password'
        );
        expect(res.statusCode).toBe(StatusCodes.CONFLICT);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    message: 'Username already in use',
                    type: 'conflict',
                }),
            ])
        );
    });
});
describe('/auth/register - email validation', () => {
    test('signup fails when email is missing', async () => {
        const res = await registerUser('testUser', '', 'password', 'password');
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Email can not be empty' }),
            ])
        );
    });
    test('signup fails when email is invalid format', async () => {
        const res = await registerUser(
            'testUser2',
            'test@',
            'password',
            'password'
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Invalid email' }),
            ])
        );
    });
    test('signup fails when email is taken', async () => {
        await registerUser(
            'testUserA',
            'duplicate@testmail.com',
            'password',
            'password'
        );
        const res = await registerUser(
            'testUserB',
            'duplicate@testmail.com',
            'password',
            'password'
        );
        expect(res.statusCode).toBe(StatusCodes.CONFLICT);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    message: 'Email already in use',
                    type: 'conflict',
                }),
            ])
        );
    });
});
describe('/auth/register - password validation', () => {
    test('Password mismatch', async () => {
        const res = await registerUser(
            'testUser',
            'test@testmail.com',
            'password',
            'anoterPassword'
        );
        expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'Passwords did not match' }),
            ])
        );
    });
});
