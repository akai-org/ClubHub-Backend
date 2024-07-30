const db = require('../repositories/mongoose/index');
const errors = require('../utils/appError')

const create = async (clubData)=>{
    await db.scienceClubRepo.create(clubData)
    return {message: "club created succesfuly!"}
}   

const getClubProfileData = async (university, name, options) => {
    let profile =  await db.scienceClubRepo.findOneByQuery({university, name})

    console.log(`##############################:
TO DO choosing to return events, meetings, projects
##############################`);

    return profile    
}

const join = async (userId, clubName) =>{
    // @description 
    let result = {success : false , 
        clubFound: false, 
        mesasge : '', 
        error : false}

    const club = await db.scienceClubRepo.FindByName(clubName)

    if(!club){ 
        result.mesasge = `Club : ${clubName} does not exist`;
        return result
    }

    if(club.isopen){
        await db.scienceClubRepo.AddMember(userId)
        result.success = true;
        result.clubFound = true;
        result.message = `Club is free to join, user joined Club : ${clubName}`; 
        return result
    }

    if(club.joinrequests.includes(userId)){
        result.success = true;
        result.clubFound = true;
        result.message = `User already send join request to ${clubName}`;
        return result
    }

    await db.scienceClubRepo.AddJoinRequest(clubName, userId)
    result.success = true;
    result.clubFound = true;
    result.message = `Club is not free to join, user join request to Club : ${clubName} send`;
    
    return result 

}

const getClubJoinRequests = async({university, name}) => {
    console.log({university, name})
    const club = await db.scienceClubRepo.findOneByQuery({university, name}); 
    console.log(club)
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
        throw new errors.NotFoundError(`club : { university : ${university}, name : ${name}} was not found`)
    }

    if(removeResult === false){
        throw new errors.NotFoundError(`join request for club : { university : ${university}, name : ${name}} was not found`)
    }

    if(decision === true){
        await db.scienceClubRepo.AddMember({university, name}, requestId)
        return true
    }
    return false 
}

const checkMembership = async (checkdClubQueryData, userUuid) =>{
    const club = await db.scienceClubRepo.findOneByQuery(checkdClubQueryData)
    //TO DO 
}   

module.exports = {create, join, resolveJoinRequest, getClubProfileData, getClubJoinRequests}