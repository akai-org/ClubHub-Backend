var jwt = require('jsonwebtoken');   
const { logger } = require('./logger/instance');
require('dotenv').config()

const createAuthToken = (data) =>{
    var token = jwt.sign(data, process.env.JWT_SECRET || "TO_DO_JWT_SECRET", { algorithm: "HS256" });

    return token
}   

const validateAuthToken = (token) => {
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "TO_DO_JWT_SECRET")
    }catch(error){
        logger.error(error.message)
        return false 
    }

    if(decoded){
        return decoded; 
    }
  
    return false; 
}

module.exports = {createAuthToken, validateAuthToken}