import request from 'supertest';
import StatusCodes from '../../utils/statusCodes.js';
import { app, resetDatabase } from '../testUtils.js';

beforeAll(async () => {
    await resetDatabase();
});

describe('GET /api/home', () => {
    test('anonymous user /api/home', async () => {
        const res = await request(app).get('/api/home');
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.loggedIn).toBe(false);
        expect(res.body.message).toBe('Welcome stranger');
        expect(res.body.trendingPosts).toBeInstanceOf(Array);
        expect(res.statusCode).toBe(StatusCodes.OK);
    });
});
