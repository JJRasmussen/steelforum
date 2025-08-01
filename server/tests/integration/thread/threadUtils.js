import request from 'supertest';
import { app } from '../../testUtils.js';

export const postThread = async (jwtToken, title, content, tagIDs) => {
    return await request(app)
        .post('/api/thread')
        .set('Authorization', jwtToken)
        .send({
            title: title,
            content: content,
            tagIDs: tagIDs,
        });
};

export const getThreads = async () => {
    return await request(app).get('/api/thread');
};
