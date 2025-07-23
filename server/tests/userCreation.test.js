import request from 'supertest';
import index from '../routes/indexRouter.js';
import express from 'express';
import userQueries from '../controllers/db/queries/userQueries.js';
import testUtils from './testUtils.js';
import errorHandler from '../errors/errorHandler.js';


const app = express();

app.use(express.urlencoded({ extended:  false }));

app.use('/', index);
app.use(errorHandler);

beforeEach(async() => {
  await testUtils.resetDatabase();
});

describe('Happy path', () => {
  test('happy path /api/users/signup', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({ 
        username: 'Test',
        email: 'a@a.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123'
      });
    expect(res.statusCode).toBe(201);
    
    const profile = await userQueries.getProfileFromUsernameLowerCase('Test'.toLowerCase());
    expect(profile).toBeDefined();
    expect(profile.usernameLowerCase).toBe('test');
    expect(profile.userId).toBeDefined();    
  });
});

describe('username validation', () => {
  test("signup fails when username is empty", async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: '',
        email: 'test@example.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username can not be empty' })
      ])
    );
  });
  test("signup fails when username is too long", async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: '123456789123456789123456789',
        email: 'test@example.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username is too long' })
      ])
    );
  });
  test("signup fails when username contains non-alphanumeric values", async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: 'testUser!:-)',
        email: 'test@example.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username must only contain letters and numbers' })
      ])
    );
  });
  test("signup fails when username is taken", async () => {
    //trying to create the user from the happy path again
    await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({ 
        username: 'testUserDuplicate',
        email: 'a@a.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123'
      });
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({ 
        username: 'testUserDuplicate',
        email: 'b@b.com',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123'
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username already in use', type: 'conflict'})
      ])
    ); 
  });
});

describe('email validation', () => {
  test("signup fails when email is missing", async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: 'testUser',
        email: '',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email can not be empty' })
      ])
    );
  });
  test("signup fails when email is invalid format", async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: '',
        email: 'test@',
        password: 'securePassword123',
        passwordConfirmation: 'securePassword123',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username can not be empty' })
      ])
    );
  });
  test("signup fails when email is taken", async () => {
    await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({ 
        username: 'testUserA',
        email: 'a@a.com',
        password: 'supersecurePassword123',
        passwordConfirmation: 'supersecurePassword123'
      });
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({ 
        username: 'testUserB',
        email: 'a@a.com',
        password: 'supersecurePassword123',
        passwordConfirmation: 'supersecurePassword123'
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email already in use', type: 'conflict'})
      ])
    ); 
  });
});

describe('password validation', () => {
  test('Password mismatch', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .type('form')
      .send({
        username: 'testUser',
        email: 'test@test.com',
        password: 'aPassword',
        passwordConfirmation: 'anotherPassword',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Passwords did not match' })
      ])
    );
  });
});