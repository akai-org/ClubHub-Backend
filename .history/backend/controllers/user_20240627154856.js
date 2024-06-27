//User Controllers /controllers/user.js
const {registerUser, loginUser, findProfileData} = require('../services/user')


const register = async (req, res) => {

    //managing request
    const {email, firstname, lastname, username, password,} = req.body
    let result; 

    try{ result = await registerUser({email, firstname, lastname, username, password,}) }
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
        if(result.duplicate) 
            res.status(409); 
        else 
            res.status(500);
    }
    res.json(result)
}

const login = async (req, res)=>{

    if(req.authenticated){
        res.status(200).json({succesfull : true, message : "User Authenticated by auth token"}); 
        return
    }
    let result;

    try{ result= await loginUser(req.body) }
    catch(error){
        console.error("error: ", error)
        result = {success : false, error : true,  message : "Internal server Error"}; 
    }

    if(result.error){ return res.status(500).json(result) }

    if(result.succesfull){
        res.status(200).json(result)
    }else {
        res.status(409).json(result)
    }
}

const profile = async (req, res) =>{

    let result
    if(!req.params.username){
        res.status(400).json({succesfull : false , message : "Path does not contain username param"})
        return
    }

    try{
        result = await findProfileData(req.params.username)
    } catch(error){
        res.status(500).json({succesfull : false , message : "Internal Server Error"})
        return
    }

    if(result.succesfull){
        res.status(200)
    }else{
        res.status(404)
    }
    res.json(result)
    
}

module.exports = {register ,login, profile}

/* 
register
    |
    \/
login 
    |
    \/
   ...
    |
    \/
logout 
*/