const db = require('../repositories/mongoose/index')
const {validateAuthToken} = require('../utils/authtoken')
require('dotenv').config()
// request -> authentication -> autorization -> route controller -> ...
const authHeader = 'authorization';

/* check user based on authenication token/header return in req.user with user data info and req.authenticated bool true if user is authenticated otherwise false */
const authenticate = async (req, res, next)=>{
    let authToken = req.headers[authHeader]; 
    if(!authToken){
        console.log("Authenticated :", false)
        req.authenticated = false; 
        return next();  
    }

    const uuid = await validateAuthToken(authToken); 
    if(!uuid){
        req.auth = {status : "Invalid authorization token",}
        console.log(req.auth.status)
        return next()
    }

    console.log("uuid :",uuid)
    const user = await db.userRepo.FindByUuid(uuid)
    //console.log("User :",user)

    if(user){
        req.authenticated = true;
        req.user = user; 
    }else{
        req.authenticated = false;
        req.user = undefined
    }
    console.log("authenticated :",req.authenticated);
    next();
}

function createpPermisionObj(){
    return{
        viewer : true, 
        member : false, 
        admin : false, 
        owner : false, 
        user : false, 
        project_owner : false, 
        project_participant : false
 
    }
}

function authorize (requiredRoles){
    return async (req, res, next) => {
        req.permissions = createpPermisionObj(); 

        if(req.authenticated){
            req.permissions.user = true
        }

        const path = req.originalUrl.split('/')

        if(path[1] === 'club' && req.params.clubname){
            if(req.user){ 
                let result = await db.scienceClubRepo.checkMemberShip(req.params.clubname, req.user.uuid)
                req.permissions = {...req.permissions, ...result}
            }
        }
        if(path[1] === 'p' && req.params.projectId){
            if(req.user){ 
                let project = await db.projectRepo.findByUuid(req.params.projectId)
                if(project){
                    if(project.owner === req.user.uuid){
                        req.permissions.project_owner = true;
                    }

                    if(project.participants.some(participant =>{ return participant.uuid === req.user.uuid })){ 
                        req.permissions.project_participant = true
                    }
                }
            }
        }

        console.log("permisions :", req.permissions)
        
        
        roles = requiredRoles.split(':')
        //check if in required roles, user have one of those role 
        const isAuthorized = roles.some(role => req.permissions[role]);
        console.log("Authorized :", isAuthorized)

        if(isAuthorized){
            return next(); 
        }
        res.status(401).json({succesfull: false, message : "Unauthorized"})
        return
    }
}

module.exports = {authenticate,authorize}