import request from 'supertest';
import {jest} from '@jest/globals'
import mainRouter from '../../mainRouter.js';
import express from 'express';
import userQueries from '../../features/auth/auth.queries.js';
import testUtils from '../testUtils.js';
import errorHandler from '../../middleware/errorHandler.js';
import StatusCodes from '../../utils/statusCodes.js'
import { authenticateUser, issueJWT } from '../../features/auth/auth.controller.js'

const app = express();

app.use(express.urlencoded({ extended:  false }));

app.use('/', mainRouter);
app.use(errorHandler);

beforeEach(async() => {
  await testUtils.resetDatabase();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});


const registerUser = async (username, email, password, passwordConfirmation) => {
  return await request(app)
    .post('/api/auth/register')
    .type('form')
    .send({ 
      username: username,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    });
}
const login = async (username, password) => {
  return await request(app)
    .post('/api/auth/login')
    .type('form')
    .send({ 
      username: username,
      password: password,
    });
}
const protectedRoute = async(jwt) => {
  return await request(app)
    .get('/api/auth/protected')
    .set('Authorization', `${jwt}`)  

}

describe('/register', () => {
  test('happy path /user/signup', async () => {
    const res = await registerUser('Test', 'a@a.com', 'password', 'password')
    expect(res.body.message).toBe('User created')
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    
    const profile = await userQueries.getProfileAndUserFromUsername('Test'.toLowerCase());
    expect(profile).toBeDefined();
    expect(profile.usernameLowerCase).toBe('test');
    expect(profile.userId).toBeDefined();    
  });
});
describe('/auth/register - username validation', () => {
  test("signup fails when username is empty", async () => {
    const res = await registerUser('', 'a@a.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username can not be empty' })
      ])
    );
  });
  test("signup fails when username is too long", async () => {
    const res = await registerUser('123456789123456789123456789', 'b@b.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username is too long' })
      ])
    );
  });
  test("signup fails when username contains non-alphanumeric values", async () => {
    const res = await registerUser('testUser!:-)', 'c@c.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username must only contain letters and numbers' })
      ])
    );
  });
  test("signup fails when username is taken", async () => {
    //trying to create the user from the happy path again
    await registerUser('testUserDuplicate', 'd@d.com', 'password', 'password')
    const res = await registerUser('testUserDuplicate', 'e@e.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Username already in use', type: 'conflict'})
      ])
    ); 
  });
});
describe('/auth/register - email validation', () => {
  test("signup fails when email is missing", async () => {
    const res = await registerUser('testUser', '', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email can not be empty' })
      ])
    );
  });
  test("signup fails when email is invalid format", async () => {
    const res = await registerUser('testUser2', 'test@', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Invalid email' })
      ])
    );
  });
  test("signup fails when email is taken", async () => {
    await registerUser('testUserA', 'duplicate@testmail.com', 'password', 'password')
    const res = await registerUser('testUserB', 'duplicate@testmail.com', 'password', 'password')
    expect(res.statusCode).toBe(StatusCodes.CONFLICT);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email already in use', type: 'conflict'})
      ])
    ); 
  });
});
describe('/auth/register - password validation', () => {
  test('Password mismatch', async () => {
    const res = await registerUser('testUser', 'test@testmail.com', 'password', 'anoterPassword')
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Passwords did not match' })
      ])
    );
  });
});
// eslint-disable-next-line max-lines-per-function
describe('/auth/login', () => {
  test('happy path - /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('Test', 'password')
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe('Successful login');
  })
  test('case insensitive - /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('tEsT', 'password')
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe('Successful login');
  })
    test('whitespace trimming - /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('   Test   ', 'password')
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe('Username or password is invalid, please try again');
  })
  test('user not found - login /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('notTest', 'password')
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe('Username or password is invalid, please try again');
  })
  test('wrong password - login /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('Test', 'wrongPassword')
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body.message).toBe('Username or password is invalid, please try again');
  })
  test('validate response contains JWT - login /auth/login', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('Test', 'password')
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe('Successful login');
    expect(res.body.token).toBeDefined();
  })
})

describe('/auth/protected', () => {
    test('validate JWT claims - protected route auth/protected', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const loginRes = await login('Test', 'password')
    const res = await protectedRoute(loginRes.body.token);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body.message).toBe('you are authorized')
  })
  test('expired JWT token - protected route auth/protected', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password');
    const profile = await authenticateUser('Test', 'password')
    const expiredToken = issueJWT(profile, '-1s')
    const res = await protectedRoute(expiredToken);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  })
  test('tampered JWT payload - protected route auth/protected', async () => {
    await registerUser('Test', 'a@a.com', 'password', 'password')
    const res = await login('Test', 'password')
    const tokenSections = res.body.token.split('.');
    console.log("Payload")
    console.log(tokenSections[1]);
    const decodedPayload = JSON.parse(Buffer.from(tokenSections[1], 'base64').toString('utf-8'))
    console.log("decodedPayload")
    console.log(decodedPayload);
    decodedPayload.role = 'ADMIN';
    const newPayload = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');
    const tamperedToken = `${tokenSections[0]}.${newPayload}.${tokenSections[2]}`;
    const secondRes = await protectedRoute(tamperedToken);
    expect(secondRes.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  })
})

/*
describe('/profile - Happy path', () => {
  test('happy path /user/profile', async () => {
    const res = await request(app)
    .get('/user/profile');
    expect(res.status).toBe(StatusCodes.FORBIDDEN);
    expect(res.body.message).toBe('You are not logged in');
  });
  test('happy path /user/profile', async () => {
    await registerUser('testUser', 'a@a.com', 'password', 'password')
    await login('testUser', 'password')
    const res = await request(app)
    .get('/user/profile')
    .type('form')
    .send({ 
      username: username,
      password: password,
    });
    expect(res.body.message).toBe('protected route reached')
  });
})*/