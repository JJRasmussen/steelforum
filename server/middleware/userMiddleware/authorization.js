function isUser(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to view this resource' });
    };
};

function isModerator(req, res, next){
    //to be implemented
}

function isMCDM(req, res, next){
    //to be implemented
}

function isAdmin(req, res, next){
     if(req.isAuthenticated() && req.user.is_admin){
        next();
    } else {
        res.status(401).json({ msg: 'You are not authorized to visit this resource because you are not an admin'})
    };
};
 
export default {
    isUser,
    isModerator,
    isMCDM,
    isAdmin,
}