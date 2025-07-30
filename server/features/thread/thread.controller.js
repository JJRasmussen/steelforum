import slugify from 'slugify';
import { nanoid } from 'nanoid';
import threadQueries from './thread.queries.js';


const slugifyTitle = (title) => {
    const slug = slugify(title, { lower: true, strict: true, trim: true });
    const randomIdLength = 8
    const randomId = nanoid(randomIdLength); 
    return randomId.concat("/", slug);
};
export async function validateTagIds(tags) {
    if (tags.length !== 0) {
        return await threadQueries.queryTagIds(tags);
    } else {
        return true;
    }
}

export async function createNewThread(title, content, tags, user) {
    const profile = await threadQueries.getProfileFromUserId(user);
    const slug = slugifyTitle(title);
    const thread = await threadQueries.addThreadToDatabase(
        title,
        content,
        tags,
        profile,
        slug
    );
    return thread;
}

