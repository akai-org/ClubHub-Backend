const db = require('../repositories/mongoose/index');
const errors = require('../utils/error/appError')
const {createAuthToken} = require('../utils/authtoken')
const bcrypt = require('bcrypt');
const {hash} = require('../utils/hash');

exports.registerUser = async (userData) => {
    userData.membership = [];
    userData.password = await hash(userData.password)
    userData.uuid = 'u' + Date.now()

    await db.userRepo.insert(userData);

    return { uuid : userData.uuid}     
};

exports.loginUser = async (loginData)=>{
    const user = await db.userRepo.FindByEmail(loginData.email); 
    if(!user){
        throw new errors.AuthenticationError('Invalid email or password')
    }

    const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password); 
    if(isPasswordCorrect){
        return {token : createAuthToken(user.uuid)}
    }

    throw new errors.AuthenticationError('Invalid email or password')
}

exports.updateUser = async (uuid, userPropertiesToUpdate)=>{
    let {error, user} = await db.userRepo.updateOne({uuid}, userPropertiesToUpdate);
    if(error){
        throw error
    }
    return {user}; 
}

exports.findProfileData = async (uuid) =>{

    if(uuid){
        const user = await db.userRepo.FindByUuid(uuid)
        if(user){
            
            return {message : "user found",  user}
        }
        throw new errors.NotFoundError(`user ${uuid} was not found`)
    }
    throw new Error('uuid not defined') //to FIX
}

exports.checkMembership = async (uuid , {university, clubname}) =>{
    let club = await db.scienceClubRepo.findOneByQuery({university, name : clubname})

    if(!club){
        throw new errors.NotFoundError('club not found when checking memberShip of user')
    }

    if(club.members.some(member => member.uuid === uuid)){
        return true
    }
    return false
}