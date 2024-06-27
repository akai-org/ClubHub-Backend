const database = require('../database/mongoose');
const {createAuthToken} = require('../utils/authtoken')
const bcrypt = require('bcrypt');
const {hash} = require('../utils/hash');



const registerUser = async (userData) => {

    if(await database.user.FindByEmail(userData.email)){
        return { succesfull : false, duplicate : true , message : "User with given email already exists", }
    }

    if(await database.user.FindByUserName(userData.username)){
        return { succesfull : false, duplicate : true , message : "User with given user name already exists", }
    }

    userData.membership = [];

    userData.password = await hash(userData.password)
    userData.uuid = Date.now()

    let result = await database.user.Insert(userData);
    
    if(result.succesfull){
        result.userId = userData.id
    } 
    return result     
};

const loginUser = async (loginData)=>{
    //checks login data against database if user exists give user a autorization token etc. 
    //bcrypt.compare
    const user = await database.user.FindByEmail(loginData.email); 
    if(!user){
        return { success : false, message : 'Invalid email or password', }
    }

    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password); 
    if(isPasswordCorrect){
        return {success : true, auth : createAuthToken(user.uuid), message : 'Login succesfull'}
    }

    return {success : false , message :'Invalid email or password'}
}

const findProfileData = async (username) =>{
    if(username){
        const user = await database.user.FindByUserName(username)
        //console.log(`user ${username}: `, user); 
        if(user){
            
            return {succesfull : true, message : "userFound", user : user.toObject()}
        }
        return {succesfull : false, message : `user ${username} was not found`} 
    }
    throw "username undefined"
    //return {succesfull : true, message : `username undefined`}
}

module.exports = {
    registerUser, loginUser, findProfileData
}