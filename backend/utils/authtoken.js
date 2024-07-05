var jwt = require('jsonwebtoken');   
require('dotenv').config()

const createAuthToken = (data) =>{
    var token = jwt.sign(data, process.env.JWT_SECRET, { algorithm: "HS256" });

    return token
}   

const validateAuthToken = (token) => {
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(error){
        console.error(error.message)
        return false 
    }

    if(decoded){
        return decoded; 
    }
  
    return false; 
}

module.exports = {createAuthToken, validateAuthToken}