import request from 'supertest';
import index from '../routes/indexRouter.js';
import express from 'express';
import userQueries from '../controllers/db/queries/userQueries.js';
import testUtils from './testUtils.js';
import { prisma } from '../controllers/db/prisma.js'

const app = express();
app.use(express.urlencoded({ extended:  false }));
app.use('/', index);

beforeAll(async() => {
  await testUtils.resetDatabase();
});

test("index route works", async () => {
  const res = await request(app).get('/');
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.body).toEqual({ name: "frodo" });
  expect(res.statusCode).toBe(200);
});

describe('GET /api/home', () => {
  test("anonymous user /api/home", async () => {
  const res = await request(app).get('/api/home')
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.body.loggedIn).toBe(false);
  expect(res.body.message).toBe('Welcome stranger');
  expect(res.body.trendingPosts).toBeInstanceOf(Array);
  expect(res.statusCode).toBe(200);
  });
})