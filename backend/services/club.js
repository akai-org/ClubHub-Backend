const db = require('../repositories/mongoose/index');

const create = async (clubData)=>{
        await db.scienceClubRepo.create(clubData)
        return {success : true, duplicate : false, message: "club created succesfuly", error : false}
}   

const join = async (userId, clubName) =>{
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

const resolveJoinRequest = async (requestId, decision, clubName)=>{
    let result =  {success : false, 
        requestFound : false, 
        isMember: false, 
        message : "",
        error : false}
    
    let remResult = await db.scienceClubRepo.removeJoinRequest(clubName, requestId)

    if(remResult.clubFound && !remResult.containsRequest){
        result.message = "Wrong request id, club does not have join request with given id"; 
        return result; 
    }

    if(decision === true){
        await db.scienceClubRepo.AddMember(clubName, requestId)
        result.success =  true;
        result.requestFound =  true;
        result.isMember=  true;
        result.message =  `User : ${requestId} became member of ${clubName}`;
    }

    result.success = true;
    result.requestFound = true;
    result.message = `User : ${requestId} did not became member of ${clubName}`;
    return result 
}


module.exports = {create, join, resolveJoinRequest}