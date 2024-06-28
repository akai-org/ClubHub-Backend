const db = require('../database/mongoose')
const clubService = require('../services/club')

const JoinRequest = async (req, res) => {
    let clubName = req.params.clubname
    let userUuid = req.user.uuid

    if(req.permissions.member || req.permissions.admin){
        res.status(200).json({succes: true, message : `Already member of ${clubName}`})
    }

    //service
    let result = await clubService.join(userUuid, clubName)
    
    //managing response
    if(result.success){
        return res.status(200).json(result); 
    }

    if(!result.clubFound){
        return res.status(404).json(result); 
    }

    if(result.error){
        return res.status(500).json(result)
    }
}

const Create = async (req, res) => {

    const body = req.body
    let data = {name : body.name, 
        univeristy : body.university, 
        isopen : body.isopen, 
        description : body.description, 
        rules : body.rules,
        admins : [req.user.uuid], 
        members : [], 
        joinrequests : []
    }
    //service
    let result;
    result = await clubService.create(data); 
    
    //managing response 
    if(result.success){
        res.status(200);
    }else{
        if(result.duplicate){
            res.status(409);
        }
        if(result.error){
            res.status(500);
        }
    } 
    res.json(result); 
}

const getClubProfile = async (req, res) => {
    //make a response based on req.permissions for viewer, member and admin
    //return data about given science club
    console.log("checking club profile")
    return res.status(200).json({message:req.params.clubname});
}

const resolveJoinRequest = async (req, res) =>{
    const {decision, requestId} = req.body
    const clubName = req.params.clubname
    
    let result = await clubService.resolveJoinRequest(requestId, decision, clubName)

    if(result.success){
        return res.status(200).json(result);
    }

    if(!result.requestFound){
        return res.status(400).json(result);
    }

    if(result.error){
        return res.status(500).json(result); 
    }

}

const getJoinRequests = async (req, res) => {
    const result = await db.club.getJoinRequests(req.params.clubname)
    res.status(200).json(result)
}

module.exports = {
    JoinRequest, Create,getClubProfile, resolveJoinRequest, getJoinRequests
}