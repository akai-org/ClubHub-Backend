const clubService = require('../services/club')

const JoinRequest = async (req, res, next) => {
    let clubName = req.params.clubname
    let userUuid = req.user.uuid

    if(req.permissions.member || req.permissions.admin){
        return res.status(200).json({succes: true, message : `Already member of ${clubName}`})
    }

    //service
    let result
    try{
        result = await clubService.join(userUuid, clubName)
    }catch(error){
        return next(error)
    }
    
    
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

const Create = async (req, res, next) => {

    const body = req.body
    let data = {
        uuid : 'c' + Date.now(), 
        name : body.name, 
        university : body.university, 
        isopen : body.isopen, 
        description : body.description, 
        rules : body.rules,
        members : [{userUuid : req.user.uuid , role : 'admin'}], 
        joinrequests : []
    }
    //service
    let result;
    try{
        result = await clubService.create(data); 
    }catch(error){
        console.log(error)
        return next(error)
    }

    res.status(200).json(result); 
}

const getClubProfile = async (req, res, next) => {

    const {university, clubname} = req.params

    const {meets, events, projects} = req.query

    let clubInfo;
    try{ 
        clubInfo = await clubService.getClubProfileData(university, clubname)
    }catch(err){
        return next(err)
    }
    return res.status(200).json({message:req.params.clubname, clubInfo});
}

const resolveJoinRequest = async (req, res, next) =>{
    const {uuid, accept} = req.body
    console.log(req.params); 
    
    let result
    try {
        result = await clubService.resolveJoinRequest(uuid, accept, {university : req.params.university, name : req.params.clubname })
    }catch(error){
        return next(error)
    }

    res.status(200).json({uuid : uuid, message : `request ${uuid} was ${accept ? '' : 'not'} acceptd`})
}

const getJoinRequests = async (req, res, next) => {
    let params = req.params
    let joinRequestList;
    try {
        joinRequestList = await clubService.getClubJoinRequests({university : params.university, name : params.clubname})
    }catch(error){
        return next(error)
    }
    res.status(200).json({joinRequests : joinRequestList})
}

module.exports = {
    JoinRequest, Create,getClubProfile, resolveJoinRequest, getJoinRequests
}