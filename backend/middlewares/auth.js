const {validateAuthToken} = require('../utils/authtoken')
require('dotenv').config()
// request -> authentication -> autorization -> route controller -> ...
const authHeader = 'authorization';

/* check user based on authenication token/header return in req.user with user data info and req.authenticated bool true if user is authenticated otherwise false */
function authenticate(req, res, next){
    let authToken = req.headers[authHeader]; 
    if(!authToken){
        req.authenticated = false; 
        return next();  
    }

    const user = validateAuthToken(authToken); 
    console.log("authenticated user :",user);

    if(user){
        req.authenticated = true;
        req.user = user; 
    }else{
        req.authenticated = false;
    }
    next();
}

function createpPermisionObj(){
    return{
        viewer : false, 
        member : false, 
        admin : false, 
        owenr : false, 
    }
}

function authorize (requiredRoles){
    return async (req, res, next) => {
        req.permisions = createpPermisionObj(); 

        if(!req.authenticated){
            req.permisions.viewer = true;  
            return next(); 
        }

        requiredRoles = requiredRoles.split(':')
        const path = req.originalUrl.split('/')


        console.log("path:", path, "\n", req.params)

        if(req.params.clubname && path[1]=='club'){
            console.log("club request check if user is a " )
        }

        console.log(`authorized roles for ${req.originalUrl}:`, requiredRoles)
        //check if req.user has any of the required roles for given path in roles array
        req.permisions = ["admin", "member"]
        //checks user roles and permisiona base on authentication process

        /*
        if user is not requiresRoles for given path 
        res.status(401).json({message : "Unauthorized: No user found"})
        for examel 
        if req.user is not member of club req.params.name
        then Unauthorized 
        */
        next();
    }
}

module.exports = {authenticate,authorize}