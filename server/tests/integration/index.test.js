import request from 'supertest';
import index from '../../mainRouter.js';
import express from 'express';
import testUtils from '../testUtils.js';
import StatusCodes from '../../utils/statusCodes.js';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/', index);

beforeAll(async () => {
    await testUtils.resetDatabase();
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
