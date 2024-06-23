const database = require('../database/mongoose');
const bcrypt = require('bcrypt');
const {hash} = require('../utils/hash');

const registerUser = async (userData) => {

    if(await database.checkForUserByEmail(userData.email)){
        return { succesfull : false, duplicate : true , message : "User with given email already exists", }
    }

    userData.password = await hash(userData.password)
    userData.id = Date.now()

    let result = await database.createNewUser(userData);
    
    if(result.succesfull){
        result.userId = userData.id
    } 
    return result     
};

const loginUser = async (loginData)=>{
    //checks login data against database if user exists give user a autorization token etc. 
    //bcrypt.compare
    const user = await database.checkForUserByEmail(loginData.email); 
    if(!user){
        return { succesfull : false, duplicate : true , message : 'Invalid email or password', }
    }

    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password); 
    if(isPasswordCorrect){

        if(!await database.addTokenForUser(user, "12345678")){
            return {succesfull : false}
        }
        return {succesfull : true, token : "123456789" /*user.token*/, id : user.id, message : 'login succesfull'}
    }

    return {succesfull : false , message :'Invalid email or password'}
}

module.exports = {
    registerUser, loginUser
}