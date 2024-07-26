const db = require('../repositories/mongoose/index');
const errors = require('../utils/appError')
const {createAuthToken} = require('../utils/authtoken')
const bcrypt = require('bcrypt');
const {hash} = require('../utils/hash');

const registerUser = async (userData) => {
    userData.membership = [];
    userData.password = await hash(userData.password)
    userData.uuid = 'u' + Date.now()

    await db.userRepo.Insert(userData);

    return { uuid : userData.uuid}     
};

const loginUser = async (loginData)=>{
    //checks login data against database if user exists give user a autorization token etc. 
    //bcrypt.compare
    const user = await db.userRepo.FindByEmail(loginData.email); 
    if(!user){
        throw new errors.AuthenticationError('Invalid email or password')
    }

    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password); 
    if(isPasswordCorrect){
        return {token : createAuthToken(user.uuid), message : 'Login succesfull'}
    }

    throw new errors.AuthenticationError('Invalid email or password')
}

const findProfileData = async (uuid) =>{

    if(uuid){
        console.log(uuid)
        const user = await db.userRepo.FindByUuid(uuid)
        if(user){
            
            return {message : "user found",  user : user.toObject()}
        }
        throw new errors.NotFoundError(`user with uuid : ${uuid} was not found`)
    }
    throw new Error('uuid not defined') //to FIX
}

module.exports = {
    registerUser, loginUser, findProfileData
}