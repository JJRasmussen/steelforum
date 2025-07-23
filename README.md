# steelforum
A fan forum for a great roleplaying game

My first project meant for real world users.

Below are thoughts and learnings in regards to the development process.

# Security 

## Password Hashing
Passwords are hashed using industry best practices w. Argon2 using salt and pepper.

# Database-development
For the database I have chosen to use PostgreSQL. I used the Prisma ORM to build it. As the number of models grew I decided to split them using into multiple files in a models folder.

## session.prisma
    Setup to support express session cookies

## user.prisma
    Information regarding the user with a user model and a profile model.
    I keep user facing information in the profile model and secret information in the user model.

## forum.prisma
    Has a model for posts, comments, votes and tags.

### Posts and Comments
    Each post will have a unique slug associated with it created from the title.

    Comments can have both a post and a comment parent, to keep track of branching discussions. 

### Votes
    Votes are being tracked in its own model with a many-to-many relation between unique pairs of profiles + posts and profiles + comments

    Currently I am thinking of allowing more than one vote (+/- 3 votes) on each post and comment depending on the users likeability of the content.

    This will be illustrated later by having an animation of a sword being drawn or sheathed further depending on the vote.

### Tags
    The tags have a one-to-many polymorphic relation as will connect game concept like a specific class or ability to posts discussing these concepts.

    The purpose is to increase UX of the search functionality.  
    
## gameData.prisma
    For a better search experience the users should be able to add tags of game concepts to their posts, like a specific class, ability or rule.
    
    Each concept will have its own tag and slug where information can be read regarding the concept.