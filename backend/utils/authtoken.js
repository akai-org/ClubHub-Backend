var jwt = require('jsonwebtoken');   
require('dotenv').config()

const createAuthToken = (data) =>{
    var token = jwt.sign(data, process.env.JWT_SECRET, { algorithm: "HS256" });

    return token
}   

const validateAuthToken = (token) => {
           
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if(decoded){
        return decoded; 
    }
  
    return false; 
}

module.exports = {createAuthToken, validateAuthToken}