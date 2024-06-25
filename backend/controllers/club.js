const database = require('../database/mongoose')

const JoinRequest = async (req, res) => {
    let clubName = req.params.clubname
    //make a request to join or joins a club based on authorization token and userID
    //if club is open then dont make a request just add user to a club members if club is closed add a request to a club request list
    if(req.permissions.member || req.permissions.admin){
        res.status(200).json({succes: true, message : `Already member of ${clubName}`})
    }

    //check if request is not alredy added
    let result = await database.AddJoinRequestToClub(clubName, req.user._id)
    
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
    let result = await database.CreateClub(req.body);
    res.status(200).json(result)
}

const getClubProfile = async (req, res) => {
    //make a response based on req.permissions for viewer, member and admin
    //return data about given science club
    console.log("checking club profile")
    return res.status(200).json({message:req.params.clubname});
}

const resolveJoinRequest = async (req, res) =>{
    
}

module.exports = {
    JoinRequest, Create,getClubProfile
}