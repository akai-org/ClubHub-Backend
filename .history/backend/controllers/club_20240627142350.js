const database = require('../database/mongoose')

const JoinRequest = async (req, res) => {
    let clubName = req.params.clubname
    //make a request to join or joins a club based on authorization token and userID
    //if club is open then dont make a request just add user to a club members if club is closed add a request to a club request list
    if(req.permissions.member || req.permissions.admin){
        res.status(200).json({succes: true, message : `Already member of ${clubName}`})
    }

    //check if request is not alredy added
    let result = await database.club.AddJoinRequest(clubName, req.user._id)
    
    if(result.success){
        return res.status(200).json(result)
    }

    if(result.error){
        return res.status(500).json(result)
    }else{
        return res.status(409).json(result)
    }


}

const Create = async (req, res) => {
    //add 
    req.body.admins = [req.user.uuid]
    let result = await database.club.Create(req.body);
    res.status(200).json(result)
}

const getClubProfile = async (req, res) => {
    //make a response based on req.permissions for viewer, member and admin
    //return data about given science club
    console.log("checking club profile")
    return res.status(200).json({message:req.params.clubname});
}

const resolveJoinRequest = async (req, res) =>{
    const {decision, requestId} = req.body
    let result;
    await database.club.removeJoinRequest(req.params.clubname, requestId)
    if(decision === true){
        result = await database.club.AddMember(req.params.clubname, requestId)
    }
    return res.status(200).json({message:"resolve", result :result});
}

module.exports = {
    JoinRequest, Create,getClubProfile, resolveJoinRequest
}