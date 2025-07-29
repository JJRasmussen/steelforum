# steelforum
A fan forum for a great roleplaying game

My first project meant for real world users.

Below are thoughts and learnings in regards to the development process.

## TODO
My project is currently focused on the backend implementation

- [ ] Add Post feature
- [ ] Add Comment feature
- [ ] Add Vote feature
- [ ] Add support for JWT refresh tokens and automatic token renewal
- [ ] Improve search functionality (fuzzy search, tag ranking)
- [ ] Add email verification and password reset
- [ ] Implement rate limiting to protect endpoints

## Security 

### Password Hashing
Passwords are hashed using industry best practices using Argon2 using salt and pepper.

### Authentication and authorization
I implemented JWT access tokens as the authorization method. Tokens are signed and returned to the client upon login with a private key. Protected routes require the token in the Authorization header using the Bearer scheme.

Refresh tokens are not implemented yet, but will be added in the future.

### Input sanitization
User input is sanitized with the help of express-validator. Malformed or unsafe inputs are caught early in the request lifecycle.

## Project architecture
To keep the project structured I have implemented a feature based architecture. Each feature is kept in its own folder with their controller, router, queries, validators etc.

## Testing
Tests are written using Jest, with Supertest for integration testing.

- All routes are tested via full Express app setup
- Includes user registration, login, token validation, and protected routes
- JWT tokens are tested for:
  - Presence in login response
  - Expiry handling
  - Tampering detection

## Error Handling
Errors are caught using a centralized error handler middleware. Custom error classes are used to pass HTTP status codes and relevant messages.

## Database-development
For the database I have chosen to use PostgreSQL. I used the Prisma ORM to build it. As the number of models grew I decided to split them using into multiple files in a models folder.

### user.prisma
    Information regarding the user with a user model and a profile model.
    I keep user facing information in the profile model and secret information in the user model.

### forum.prisma
    Has a model for posts, comments, votes and tags.

#### Threads and Comments
    Each post will have a unique slug associated with it created from the title.

    Comments can have both a post and a comment parent, to keep track of branching discussions. 

#### Votes
    Votes are being tracked in its own model with a many-to-many relation between unique pairs of profiles + posts and profiles + comments

    Currently I am thinking of allowing more than one vote (+/- 3 votes) on each post and comment depending on the users likeability of the content.

    This will be illustrated later by having an animation of a sword being drawn or sheathed further depending on the vote.

#### Tags
    The tags have a one-to-many polymorphic relation as will connect game concept like a specific class or ability to posts discussing these concepts.

    The purpose is to increase UX of the search functionality.  
    
### gameData.prisma
    For a better search experience the users should be able to add tags of game concepts to their posts, like a specific class, ability or rule.
    
    Each concept will have its own tag and slug where information can be read regarding the concept.

## Code Quality
To ensure a high level of code quality I am using ESLint and Prettier.