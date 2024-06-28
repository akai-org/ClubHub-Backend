const db = require('../database/mongoose')

const create = async (clubData)=>{

    try{
        await db.club.create(clubData)
        return {success : true, duplicate : false, message: "club created succesfuly", error : false}

    }catch(err){
        
        if(err.code === 11000 || err.code === 11001)
        {
            return {success : false, duplicate : true, message: "Club with given data already exists, check uniqueness of club name" , error : false}
        }else{
            console.log('Error creating new club: \n', err.name, err.message)
            return {success : false, duplicate : false, message :"Unhandled Internal error",  error : true}
        }
    }
}   

const join = async (userId, clubName) =>{
    let result = {success : false , 
        clubFound: false, 
        mesasge : '', 
        error : false}
    try{
        const club = await db.club.FindByName(clubName)

        if(!club){ 
            result.mesasge = `Club : ${clubName} does not exist`;
            return result
        }

        if(club.isopen){
            await db.club.AddMember(userId)
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

        await db.club.AddJoinRequest(clubName, userId)
        result.success = true;
        result.clubFound = true;
        result.message = `Club is not free to join, user join request to Club : ${clubName} send`;
        
        return result 
    }catch(error){
        console.error(error);
        result.message = `Internal unhandled error occured`; 
        result.error = true
        return result
    }

}

const resolveJoinRequest = async (requestId, decision, clubName)=>{
    let result =  {success : false, 
        requestFound : false, 
        isMember: false, 
        message : "",
        error : false}
    try{
        let remResult = await db.club.removeJoinRequest(clubName, requestId)

        if(remResult.clubFound && !remResult.containsRequest){
           result.message = "Wrong request id, club does not have join request with given id"; 
           return result; 
        }

        if(decision === true){
            await db.club.AddMember(clubName, requestId)
            result.success =  true;
            result.requestFound =  true;
            result.isMember=  true;
            result.message =  `User : ${requestId} became member of ${clubName}`;
        }

        result.success = true;
        result.requestFound = true;
        result.message = `User : ${requestId} did not became member of ${clubName}`;
        return result 

    }catch(error){
        console.error(error)
        result.message = `Internal unhandled error`;
        result.error = true; 
        return result; 
    }
}


module.exports = {create, join, resolveJoinRequest}