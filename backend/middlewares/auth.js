const db = require('../repositories/mongoose/index')
const {validateAuthToken} = require('../utils/authtoken')

const errors = require('../utils/error/appError');
require('dotenv').config()
// request -> authentication -> autorization -> route controller -> ...
const authHeader = 'authorization';

/* check user based on authenication token/header return in req.user with user data info and req.authenticated bool true if user is authenticated otherwise false */
const authenticate = async (req, res, next)=>{
    let authToken = req.headers[authHeader]; 
    if(!authToken){
        logger.debug("Authenticated :", false)
        req.authenticated = false; 
        return next();  
    }

    const uuid = await validateAuthToken(authToken); 
    if(!uuid){
        req.auth = {status : "Invalid authorization token",}
        logger.debug(req.auth.status)
        return next()
    }

    logger.debug("User uuid :",uuid)
    const user = await db.userRepo.FindByUuid(uuid)

    if(user){
        req.authenticated = true;
        req.user = user; 
    }else{
        req.authenticated = false;
        req.user = undefined
    }
    logger.debug("Authenticated :",req.authenticated);
    next();
}

function createpPermisionObj(){
    return{ 
        member : false, 
        admin : false, 
        user : false, 
    }
}

function authorize (requiredRoles){
    return async (req, res, next) => {
        req.permissions = createpPermisionObj(); 

        if(req.authenticated){
            req.permissions.user = true
        }else{
            return next(new errors.AuthorizationError('unauthenticated request'))
        }

        if(req.params.clubname){
            if(req.authenticated){ 
                let result = await db.scienceClubRepo.checkMemberShip(req.params.clubname, req.user.uuid)
                req.permissions = {...req.permissions, ...result}
                if(req.permissions.admin === true){
                    req.permissions.member = true; 
                }
            }
        }

        logger.debug("permisions :", req.permissions)
        
        
        roles = requiredRoles.split(':')
        const isAuthorized = roles.some(role => req.permissions[role]);
        logger.debug("Authorized :", isAuthorized)

        if(isAuthorized){
            return next(); 
        }
        throw new errors.AuthorizationError('unathorized request')
    }
}

module.exports = {authenticate,authorize}