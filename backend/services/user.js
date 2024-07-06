const db = require('../repositories/mongoose/index');
const {createAuthToken} = require('../utils/authtoken')
const bcrypt = require('bcrypt');
const {hash} = require('../utils/hash');

const registerUser = async (userData) => {

    if(await db.userRepo.FindByEmail(userData.email)){
        return { success : false, status : 'fail' , errType : 'duplicate' , message : "User with given email already exists", error :false }
    }

    if(await db.userRepo.FindByUserName(userData.username)){
        return { success : false, status : 'fail' , errType : 'duplicate', error : true , message : "User with given user name already exists", error :false }
    }

    userData.membership = [];
    userData.password = await hash(userData.password)
    userData.uuid = Date.now()

    let result = await db.userRepo.Insert(userData);
    return result     
};

const loginUser = async (loginData)=>{
    //checks login data against database if user exists give user a autorization token etc. 
    //bcrypt.compare
    const user = await db.userRepo.FindByEmail(loginData.email); 
    if(!user){
        return { success : false, message : 'Invalid email or password', error :false}
    }

    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password); 
    if(isPasswordCorrect){
        return {success : true, auth : createAuthToken(user.uuid), message : 'Login succesfull', error :false}
    }

    return {success : false , message :'Invalid email or password', error :false}
}

const findProfileData = async (username) =>{
    if(username){
        const user = await db.userRepo.FindByUserName(username)
        //console.log(`user ${username}: `, user); 
        if(user){
            
            return {success : true, message : "userFound",error : false,  user : user.toObject()}
        }
        return {success : false, message : `user ${username} was not found`, error : false} 
    }
}

module.exports = {
    registerUser, loginUser, findProfileData
}