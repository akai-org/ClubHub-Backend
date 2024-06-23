//User Controllers /controllers/user.js

const {registerUser, loginUser} = require('../services/user')

const register = async (req, res) => {

    //managing request
    const {email, password, name} = req.body
    let result; 

    try{ result = await registerUser({email, password, name}) }
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
    const {email, password} = req.body; 

    if(!(email && password)){
        res.status(400).json({succesfull :false , message: "Not all neccesary data is in request"})
        return 
    }

    let result;

    try{ result= await loginUser(req.body) }
    catch(error){
        console.error("error: ", error)
        result = {succesfull : false, error : true,  message : "Internal server Error"}; 
       
    }

    if(result.error){ return res.status(500).json(result) }

    if(result.succesfull){
        res.status(200).json(result)
    }else {
        res.status(409).json(result)
    }
}

module.exports = {register ,login}

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