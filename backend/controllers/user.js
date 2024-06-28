//User Controllers /controllers/user.js
const {registerUser, loginUser, findProfileData} = require('../services/user')


const register = async (req, res) => {
    let result; 

    //service 
    try{ result = await registerUser(req.body) }
    catch(error) {
        console.error('Error in register controller:', error.message);
        result = { succesfull : false, error: true,  message : "Internal server Error" }
        console.log(error);
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

const login = async (req, res)=>{

    if(req.authenticated){
        res.status(200).json({succesfull : true, message : "User Authenticated by auth token", error : false}); 
        return
    }
    let result;

    //service 
    try{ result= await loginUser(req.body) }
    catch(error){
        console.error("error: ", error)
        result = {success : false, error : true,  message : "Internal server Error"}; 
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

const profile = async (req, res) =>{

    let result
    if(!req.params.username){
        res.status(400).json({succesfull : false , message : "Path does not contain username param", error : false})
        return
    }

    //service 
    try{ result = await findProfileData(req.params.username) }
    catch(error){
        console.error(`Error on path ${req.originalUrl} :`, error)
        res.status(500).json({success : false ,error : true, message : "Internal Server Error"})
        return
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
