import request from 'supertest';
import { app } from '../../testUtils.js';

export const registerUser = async (
    username,
    email,
    password,
    passwordConfirmation
) => {
    return await request(app).post('/api/auth/register').type('form').send({
        username: username,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
    });
};
export const login = async (username, password) => {
    return await request(app).post('/api/auth/login').type('form').send({
        username: username,
        password: password,
    });
};
export const protectedRoute = async (jwt) => {
    return await request(app)
        .get('/api/auth/protected')
        .set('Authorization', `${jwt}`);
};
