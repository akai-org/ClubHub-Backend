const db = require('../repositories/'+ require('config').get('repositoryInUse' )+'/index');
const errors = require('../utils/error/appError')

const create = async (clubData)=>{
    let club = await db.scienceClubRepo.insert(clubData)
    return club
}   

const getClubProfileData = async (university, name) => {
    let profile =  await db.scienceClubRepo.findOneByQuery({university, name})
    if(!profile){ 
        throw new errors.NotFoundError(`Club was not found`)
    }
    return profile    
}

const join = async (userId, {name, university}) =>{

    const club = await db.scienceClubRepo.findOneByQuery({name, university})

    if(!club){ 
        throw new errors.NotFoundError(`Club : ${name} does not exist`); 
    }

    if(club.members.some(member => {member.uuid === userId})){
        throw new errors.AlreadyExistsError(`User : ${userId} already is a mmeber of club : { univeristy : ${university}, name : ${clubName}}`);
    }

    if(club.isopen){
        await db.scienceClubRepo.AddMember({name, university }, userId)
        return {message: "club is open user is a member", member : userId}
    }

    if(club.joinrequests.includes(userId)){
        throw new errors.AlreadyExistsError(`User : ${userId} already send join request to club : { univeristy : ${university}, name : ${clubName}}`);
    }

    await db.scienceClubRepo.AddJoinRequest(name, userId)
    return { message : "club is not open join request send",joinRequest : userId} 
}

const getClubJoinRequests = async({university, name}) => {
    const club = await db.scienceClubRepo.findOneByQuery({university, name}); 

    if(club){
        return club.joinrequests;
    }else{
        let clubData = {university, name};
        throw new errors.NotFoundError(`provided club data : {${ 'university : '+clubData.university + ", name : " + clubData.name}} was not found`)
    }

}

const resolveJoinRequest = async (requestId, decision, {university, name})=>{

    let removeResult = await db.scienceClubRepo.removeJoinRequest({university, name}, requestId)

    if(removeResult === undefined){
        throw new errors.NotFoundError(`Science club : { university : ${university}, name : ${name}} was not found`)
    }

    if(removeResult === false){
        throw new errors.NotFoundError(`Join request : ${requestId} for club : { university : ${university}, name : ${name}} was not found`)
    }

    if(decision === true){
        await db.scienceClubRepo.AddMember({university, name}, requestId)
        return true
    }
    return false 
}

// const checkMembership = async (checkdClubQueryData, userUuid) =>{
//     const club = await db.scienceClubRepo.findOneByQuery(checkdClubQueryData)
//     //TO DO 
// }   

module.exports = {create, join, resolveJoinRequest, getClubProfileData, getClubJoinRequests}