import slugify from 'slugify';
import { nanoid } from 'nanoid';
import threadQueries from './thread.queries.js';

const slugifyTitle = (title) => {
    const slug = slugify(title, { lower: true, strict: true, trim: true });
    const randomIDLength = 8;
    const randomID = nanoid(randomIDLength);
    return randomID.concat('/', slug);
};
export async function validateTagIds(tags) {
    if (tags.length !== 0) {
        return await threadQueries.queryTagIds(tags);
    } else {
        return true;
    }
}

export async function createNewThread(title, content, tagIDs, user) {
    const profile = await threadQueries.getProfileFromUserId(user);
    const slug = slugifyTitle(title);
    const thread = await threadQueries.addThreadToDatabase(
        title,
        content,
        tagIDs,
        profile,
        slug
    );
    return thread;
}

export async function getAllThreads() {
    const threads = await threadQueries.queryEveryThread();
    return threads;
}
