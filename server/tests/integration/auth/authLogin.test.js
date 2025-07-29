import { jest } from '@jest/globals';
import StatusCodes from '../../../utils/statusCodes.js';
import {
    authenticateUser,
    issueJWT,
} from '../../../features/auth/auth.controller.js';
import { registerUser, login, protectedRoute } from './authUtils.js';

beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password');
})

// eslint-disable-next-line max-lines-per-function
describe('/auth/login', () => {
    test('happy path - /auth/login', async () => {
        const res = await login('Test', 'password');
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Successful login');
    });
    test('case insensitive - /auth/login', async () => {
        const res = await login('tEsT', 'password');
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Successful login');
    });
    test('whitespace trimming - /auth/login', async () => {
        const res = await login('   Test   ', 'password');
        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.message).toBe(
            'Username or password is invalid, please try again'
        );
    });
    test('user not found - login /auth/login', async () => {
        const res = await login('notTest', 'password');
        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.message).toBe(
            'Username or password is invalid, please try again'
        );
    });
    test('wrong password - login /auth/login', async () => {
        const res = await login('Test', 'wrongPassword');
        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.message).toBe(
            'Username or password is invalid, please try again'
        );
    });
    test('validate response contains JWT - login /auth/login', async () => {
        const res = await login('Test', 'password');
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('Successful login');
        expect(res.body.token).toBeDefined();
    });
});
describe('/auth/protected', () => {
    test('validate JWT claims - protected route auth/protected', async () => {
        await registerUser('Test', 'a@a.com', 'password', 'password');
        const loginRes = await login('Test', 'password');
        const res = await protectedRoute(loginRes.body.token);
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body.message).toBe('you are authorized');
    });
    test('expired JWT token - protected route auth/protected', async () => {
        await registerUser('Test', 'a@a.com', 'password', 'password');
        const profile = await authenticateUser('Test', 'password');
        const expiredToken = issueJWT(profile, '-1s');
        const res = await protectedRoute(expiredToken);
        expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
    test('tampered JWT payload - protected route auth/protected', async () => {
        await registerUser('Test', 'a@a.com', 'password', 'password');
        const res = await login('Test', 'password');
        const tokenSections = res.body.token.split('.');
        const decodedPayload = JSON.parse(
            Buffer.from(tokenSections[1], 'base64').toString('utf-8')
        );
        decodedPayload.role = 'ADMIN';
        const newPayload = Buffer.from(JSON.stringify(decodedPayload)).toString(
            'base64url'
        );
        const tamperedToken = `${tokenSections[0]}.${newPayload}.${tokenSections[2]}`;
        const secondRes = await protectedRoute(tamperedToken);
        expect(secondRes.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
});
