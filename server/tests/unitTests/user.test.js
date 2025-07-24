import request from 'supertest';
import mainRouter from '../../mainRouter.js';
import express from 'express';
import userQueries from '../../features/user/user.queries.js';
import testUtils from '../testUtils.js';
import errorHandler from '../../middleware/errorHandler.js';
import StatusCodes from '../../utils/statusCodes.js'
const app = express();

app.use(express.urlencoded({ extended:  false }));

app.use('/', mainRouter);
app.use(errorHandler);

beforeEach(async() => {
  await testUtils.resetDatabase();
});

const userCreationForTests = async (username, email, password, passwordConfirmation) => {
  return await request(app)
    .post('/user/signup')
    .type('form')
    .send({ 
      username: username,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    });
}

describe('Happy path', () => {
  test('happy path /user/signup', async () => {
    const res = await userCreationForTests('Test', 'a@a.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    
    const profile = await userQueries.getProfileFromUsernameLowerCase('Test'.toLowerCase());
    expect(profile).toBeDefined();
    expect(profile.usernameLowerCase).toBe('test');
    expect(profile.userId).toBeDefined();    
  });
});

describe('username validation', () => {
  test("signup fails when username is empty", async () => {
    const res = await userCreationForTests('', 'a@a.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username can not be empty' })
      ])
    );
  });
  test("signup fails when username is too long", async () => {
    const res = await userCreationForTests('123456789123456789123456789', 'b@b.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username is too long' })
      ])
    );
  });
  test("signup fails when username contains non-alphanumeric values", async () => {
    const res = await userCreationForTests('testUser!:-)', 'c@c.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username must only contain letters and numbers' })
      ])
    );
  });
  test("signup fails when username is taken", async () => {
    //trying to create the user from the happy path again
    await userCreationForTests('testUserDuplicate', 'd@d.com', 'password', 'password')
    const res = await userCreationForTests('testUserDuplicate', 'e@e.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username already in use', type: 'conflict'})
      ])
    ); 
  });
});

describe('email validation', () => {
  test("signup fails when email is missing", async () => {
    const res = await userCreationForTests('testUser', '', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email can not be empty' })
      ])
    );
  });
  test("signup fails when email is invalid format", async () => {
    const res = await userCreationForTests('testUser2', 'test@', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Invalid email' })
      ])
    );
  });
  test("signup fails when email is taken", async () => {
    await userCreationForTests('testUserA', 'duplicate@testmail.com', 'password', 'password')
    const res = await userCreationForTests('testUserB', 'duplicate@testmail.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email already in use', type: 'conflict'})
      ])
    ); 
  });
});

describe('password validation', () => {
  test('Password mismatch', async () => {
    const res = await userCreationForTests('testUser', 'test@testmail.com', 'password', 'anoterPassword')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Passwords did not match' })
      ])
    );
  });
});