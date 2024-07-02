//User Controllers /controllers/user.js
const {registerUser, loginUser, findProfileData} = require('../services/user')


const register = async (req, res, next) => {
    let result; 

    //service 
    try{ result = await registerUser(req.body) }
    catch(error) {
        return next(error)
    }

    //managing response
    if(result.error){ return res.status(500).json(result) }

    if(result.succesfull){
        res.status(200)
    }else{
        if(result.duplicate) {
            res.status(409); 
        }
        else {
            res.status(500); 
            // probably wont ever happen cause of what registerUser service return but its edge case which best is to cover
        }
    }
    res.json(result)
}

const login = async (req, res, next)=>{

    if(req.authenticated){
        res.status(200).json({succesfull : true, message : "User Authenticated by auth token", error : false}); 
        return
    }
    let result;

    //service 
    try{ result= await loginUser(req.body) }
    catch(error){
        return next(error) 
    }

    // managing response
    if(result.error){ res.status(500) }
    else{
        if(result.success){
            res.status(200)
        }else {
            res.status(409)
        }
    }
    res.json(result)
}

const profile = async (req, res, next) =>{

    let result
    if(!req.params.username){
        res.status(400).json({succesfull : false , message : "Path does not contain username param", error : false})
        return
    }

    //service 
    try{ result = await findProfileData(req.params.username) }
    catch(error){
        return next(error)
    }

    //managing response 
    if(result.success){
        res.status(200)
    }else{
        res.status(404)
    }
    res.json(result)
    
}

module.exports = {register ,login, profile}
